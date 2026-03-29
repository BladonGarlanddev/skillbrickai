import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Upvote } from "../components/upvote";
import { skills, domains } from "../data/mock-data";

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get("domain") || "all");
  const [sortBy, setSortBy] = useState<"trending" | "newest">("trending");

  const filteredSkills = useMemo(() => {
    let filtered = skills;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        skill =>
          skill.title.toLowerCase().includes(query) ||
          skill.description.toLowerCase().includes(query) ||
          skill.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by domain
    if (selectedDomain !== "all") {
      filtered = filtered.filter(skill => skill.domain === selectedDomain);
    }

    // Sort
    if (sortBy === "trending") {
      filtered = [...filtered].sort((a, b) => b.downloads - a.downloads);
    } else {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return filtered;
  }, [searchQuery, selectedDomain, sortBy]);

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    if (domain === "all") {
      searchParams.delete("domain");
    } else {
      searchParams.set("domain", domain);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Search Section */}
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl mb-4 text-center">Browse Skills</h1>
        <p className="text-foreground/60 text-center mb-8 leading-relaxed">
          Discover prompts that make AI agents smarter in specific domains
        </p>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <Input
            type="text"
            placeholder="Search skills, tags, or domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base border-black/10 focus:border-black/20"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 pb-6 border-b border-black/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Filter by Domain</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground/50">Sort by:</span>
            <Button
              variant={sortBy === "trending" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("trending")}
            >
              Trending
            </Button>
            <Button
              variant={sortBy === "newest" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("newest")}
            >
              Newest
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedDomain === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleDomainChange("all")}
          >
            All Domains
          </Button>
          {domains.map(domain => (
            <Button
              key={domain}
              variant={selectedDomain === domain ? "default" : "outline"}
              size="sm"
              onClick={() => handleDomainChange(domain)}
            >
              {domain}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-sm text-foreground/50">
          {filteredSkills.length} {filteredSkills.length === 1 ? 'skill' : 'skills'} found
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid gap-4">
        {filteredSkills.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground/50 mb-2">No skills found</p>
            <p className="text-sm text-foreground/40">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          filteredSkills.map(skill => (
            <Link
              key={skill.id}
              to={`/skill/${skill.id}`}
              className="group block p-6 rounded-lg border border-black/5 hover:border-black/15 hover:shadow-sm transition-all bg-white"
            >
              <div className="flex items-start gap-4">
                <img
                  src={skill.author.avatar}
                  alt={skill.author.name}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1 group-hover:text-foreground/80 transition-colors">
                        {skill.title}
                      </h3>
                      <p className="text-sm text-foreground/50">
                        by {skill.author.name}
                      </p>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0">
                      {skill.domain}
                    </Badge>
                  </div>

                  <p className="text-foreground/70 leading-relaxed mb-4">
                    {skill.description}
                  </p>

                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex flex-wrap gap-2">
                      {skill.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-sm text-foreground/40 ml-auto">
                      {skill.downloads.toLocaleString()} uses
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}