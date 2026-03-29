import { Link } from "react-router";
import { ConnectedNodes } from "../components/connected-nodes";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { skills, featuredSkillIds, trendingSkillIds, domains } from "../data/mock-data";

export default function HomePage() {
  const featuredSkills = skills.filter(s => featuredSkillIds.includes(s.id));
  const trendingSkills = skills.filter(s => trendingSkillIds.includes(s.id)).slice(0, 5);

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 opacity-40">
          <ConnectedNodes />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 mb-6">
            <Sparkles className="w-3 h-3" />
            <span className="text-sm">A library for AI</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl mb-6 tracking-tight">
            Knowledge transfer,
            <br />
            at machine scale
          </h1>
          
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Collective is a community library where humans deposit accumulated knowledge
            so that any AI, anywhere, can draw from it. Browse, copy, and make your agents smarter.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/browse">
              <Button size="lg" className="gap-2">
                Browse Skills
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/submit">
              <Button size="lg" variant="outline">
                Contribute a Skill
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="w-5 h-5 text-foreground/40" />
          <h2 className="text-2xl">Featured Skills</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {featuredSkills.map(skill => (
            <Link
              key={skill.id}
              to={`/skill/${skill.id}`}
              className="group block p-6 rounded-lg border border-black/5 hover:border-black/15 hover:shadow-sm transition-all bg-white"
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={skill.author.avatar}
                  alt={skill.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium group-hover:text-foreground/80 transition-colors">
                    {skill.title}
                  </h3>
                  <p className="text-sm text-foreground/50">
                    by {skill.author.name}
                  </p>
                </div>
              </div>
              
              <p className="text-foreground/70 leading-relaxed mb-4">
                {skill.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {skill.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Skills */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="w-5 h-5 text-foreground/40" />
          <h2 className="text-2xl">Trending</h2>
        </div>

        <div className="space-y-3">
          {trendingSkills.map((skill, index) => (
            <Link
              key={skill.id}
              to={`/skill/${skill.id}`}
              className="group flex items-center gap-4 p-4 rounded-lg hover:bg-foreground/[0.02] transition-colors"
            >
              <div className="text-foreground/30 font-medium w-8 text-center">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium group-hover:text-foreground/80 transition-colors">
                  {skill.title}
                </h3>
                <p className="text-sm text-foreground/50 truncate">
                  {skill.description}
                </p>
              </div>

              <div className="text-sm text-foreground/40">
                {skill.downloads.toLocaleString()} uses
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Domain Categories */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-black/5">
        <h2 className="text-2xl mb-8">Browse by Domain</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {domains.map(domain => (
            <Link
              key={domain}
              to={`/browse?domain=${encodeURIComponent(domain)}`}
              className="p-4 rounded-lg border border-black/5 hover:border-black/15 hover:bg-foreground/[0.02] transition-all text-center"
            >
              <div className="font-medium">{domain}</div>
              <div className="text-sm text-foreground/50 mt-1">
                {skills.filter(s => s.domain === domain).length} skills
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-2xl mb-12 text-center">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
              <span className="font-medium">1</span>
            </div>
            <h3 className="font-medium mb-2">Browse the Library</h3>
            <p className="text-foreground/60 text-sm leading-relaxed">
              Explore skills across domains—from writing to code review to research synthesis.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
              <span className="font-medium">2</span>
            </div>
            <h3 className="font-medium mb-2">Copy the Prompt</h3>
            <p className="text-foreground/60 text-sm leading-relaxed">
              Each skill is a carefully crafted prompt. Copy it with a single click.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-4">
              <span className="font-medium">3</span>
            </div>
            <h3 className="font-medium mb-2">Paste Into Your Agent</h3>
            <p className="text-foreground/60 text-sm leading-relaxed">
              Use it with Claude, ChatGPT, or any AI. Make your agent an expert instantly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
