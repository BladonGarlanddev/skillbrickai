-- Enable extensions used for search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ──────────────────────────────────────────────────────────────────────────
-- Skill search vector
-- ──────────────────────────────────────────────────────────────────────────

ALTER TABLE "Skill" ADD COLUMN IF NOT EXISTS "searchVector" tsvector;

CREATE OR REPLACE FUNCTION skill_build_search_vector(skill_id text)
RETURNS tsvector AS $$
  SELECT
    setweight(to_tsvector('english', coalesce(s.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(
      (SELECT string_agg(t.tag, ' ') FROM "SkillTag" t WHERE t."skillId" = s.id),
      ''
    )), 'A') ||
    setweight(to_tsvector('english', coalesce(s.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(s.domain, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(s.content, '')), 'C')
  FROM "Skill" s
  WHERE s.id = skill_id;
$$ LANGUAGE sql STABLE;

-- Row-level trigger function: builds the vector from NEW.* fields directly.
-- Pulls tags by sub-select (ResearchTag rows exist independently of the Research row,
-- so the sub-select works even during BEFORE INSERT — it simply returns an empty string
-- if tags haven't been inserted yet, and the SkillTag trigger below will refresh later).
CREATE OR REPLACE FUNCTION skill_refresh_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW."searchVector" :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(
      (SELECT string_agg(t.tag, ' ') FROM "SkillTag" t WHERE t."skillId" = NEW.id),
      ''
    )), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.domain, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- BEFORE trigger on Skill row changes: updates searchVector in-place.
DROP TRIGGER IF EXISTS skill_search_vector_row ON "Skill";
CREATE TRIGGER skill_search_vector_row
BEFORE INSERT OR UPDATE OF name, description, content, domain ON "Skill"
FOR EACH ROW EXECUTE FUNCTION skill_refresh_search_vector();

CREATE OR REPLACE FUNCTION skill_tag_refresh_search_vector()
RETURNS trigger AS $$
DECLARE
  target_id text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_id := OLD."skillId";
  ELSE
    target_id := NEW."skillId";
  END IF;
  UPDATE "Skill"
  SET "searchVector" = skill_build_search_vector(target_id)
  WHERE id = target_id;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- AFTER trigger on SkillTag changes: updates parent skill's searchVector.
DROP TRIGGER IF EXISTS skill_tag_search_vector ON "SkillTag";
CREATE TRIGGER skill_tag_search_vector
AFTER INSERT OR UPDATE OR DELETE ON "SkillTag"
FOR EACH ROW EXECUTE FUNCTION skill_tag_refresh_search_vector();

-- GIN index for full-text search
CREATE INDEX IF NOT EXISTS "Skill_searchVector_idx" ON "Skill" USING gin("searchVector");

-- Trigram indexes for fuzzy/typo matching
CREATE INDEX IF NOT EXISTS "Skill_name_trgm_idx" ON "Skill" USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Skill_description_trgm_idx" ON "Skill" USING gin(description gin_trgm_ops);

-- Backfill existing rows
UPDATE "Skill" SET "searchVector" = skill_build_search_vector(id);

-- ──────────────────────────────────────────────────────────────────────────
-- Research search vector
-- ──────────────────────────────────────────────────────────────────────────

ALTER TABLE "Research" ADD COLUMN IF NOT EXISTS "searchVector" tsvector;

CREATE OR REPLACE FUNCTION research_build_search_vector(research_id text)
RETURNS tsvector AS $$
  SELECT
    setweight(to_tsvector('english', coalesce(r.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(
      (SELECT string_agg(t.tag, ' ') FROM "ResearchTag" t WHERE t."researchId" = r.id),
      ''
    )), 'A') ||
    setweight(to_tsvector('english', coalesce(r.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(r.domain, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(r."keyFindings", '')), 'B') ||
    setweight(to_tsvector('english', coalesce(r.methodology, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(r.content, '')), 'C')
  FROM "Research" r
  WHERE r.id = research_id;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION research_refresh_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW."searchVector" :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(
      (SELECT string_agg(t.tag, ' ') FROM "ResearchTag" t WHERE t."researchId" = NEW.id),
      ''
    )), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.domain, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW."keyFindings", '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.methodology, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS research_search_vector_row ON "Research";
CREATE TRIGGER research_search_vector_row
BEFORE INSERT OR UPDATE OF name, description, content, domain, "keyFindings", methodology ON "Research"
FOR EACH ROW EXECUTE FUNCTION research_refresh_search_vector();

CREATE OR REPLACE FUNCTION research_tag_refresh_search_vector()
RETURNS trigger AS $$
DECLARE
  target_id text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_id := OLD."researchId";
  ELSE
    target_id := NEW."researchId";
  END IF;
  UPDATE "Research"
  SET "searchVector" = research_build_search_vector(target_id)
  WHERE id = target_id;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS research_tag_search_vector ON "ResearchTag";
CREATE TRIGGER research_tag_search_vector
AFTER INSERT OR UPDATE OR DELETE ON "ResearchTag"
FOR EACH ROW EXECUTE FUNCTION research_tag_refresh_search_vector();

CREATE INDEX IF NOT EXISTS "Research_searchVector_idx" ON "Research" USING gin("searchVector");
CREATE INDEX IF NOT EXISTS "Research_name_trgm_idx" ON "Research" USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Research_description_trgm_idx" ON "Research" USING gin(description gin_trgm_ops);

UPDATE "Research" SET "searchVector" = research_build_search_vector(id);
