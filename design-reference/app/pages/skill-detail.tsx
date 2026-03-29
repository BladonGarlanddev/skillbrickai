import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Copy, Check, Download, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Upvote } from "../components/upvote";
import { skills } from "../data/mock-data";

export default function SkillDetailPage() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const skill = skills.find(s => s.id === skillId);

  if (!skill) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-foreground/50 mb-4">Skill not found</p>
        <Link to="/browse">
          <Button variant="outline">Browse All Skills</Button>
        </Link>
      </div>
    );
  }

  const relatedSkills = skills.filter(s => skill.relatedSkills.includes(s.id));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(skill.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([skill.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${skill.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-black/5 bg-foreground/[0.01]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-start gap-6 mb-6">
            <Link to={`/profile/${skill.author.id}`}>
              <img
                src={skill.author.avatar}
                alt={skill.author.name}
                className="w-16 h-16 rounded-full hover:opacity-80 transition-opacity"
              />
            </Link>

            <div className="flex-1">
              <h1 className="text-4xl mb-3">{skill.title}</h1>
              <p className="text-lg text-foreground/70 leading-relaxed mb-4">
                {skill.description}
              </p>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-foreground/50">by</span>
                <Link
                  to={`/profile/${skill.author.id}`}
                  className="font-medium hover:text-foreground/70 transition-colors"
                >
                  {skill.author.name}
                </Link>
                <span className="text-foreground/30">•</span>
                <span className="text-foreground/50">
                  {new Date(skill.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleCopy} className="gap-2">
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Prompt
                </>
              )}
            </Button>
            <Button onClick={handleDownload} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Upvote initialCount={skill.upvotes} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr,280px] gap-12">
          {/* Skill Content */}
          <div>
            <div className="prose prose-neutral max-w-none">
              <div className="bg-foreground/[0.02] border border-black/5 rounded-lg p-8">
                <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-foreground/90">
                  {skill.content}
                </pre>
              </div>
            </div>

            {/* Suggest Improvement */}
            <div className="mt-6 text-center">
              <button className="text-sm text-foreground/50 hover:text-foreground transition-colors">
                Suggest an Improvement
              </button>
            </div>

            {/* Related Skills */}
            {relatedSkills.length > 0 && (
              <div className="mt-16 pt-12 border-t border-black/5">
                <h2 className="text-2xl mb-6">Related Skills</h2>
                
                <div className="grid gap-4">
                  {relatedSkills.map(relatedSkill => (
                    <Link
                      key={relatedSkill.id}
                      to={`/skill/${relatedSkill.id}`}
                      className="group block p-5 rounded-lg border border-black/5 hover:border-black/15 hover:bg-foreground/[0.01] transition-all"
                    >
                      <h3 className="font-medium mb-1 group-hover:text-foreground/80 transition-colors">
                        {relatedSkill.title}
                      </h3>
                      <p className="text-sm text-foreground/60 mb-3">
                        {relatedSkill.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {relatedSkill.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Metadata */}
            <div className="p-6 rounded-lg border border-black/5 bg-foreground/[0.01]">
              <h3 className="font-medium mb-4">Details</h3>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-foreground/50 mb-1">Domain</div>
                  <Badge variant="outline">{skill.domain}</Badge>
                </div>

                <div>
                  <div className="text-foreground/50 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {skill.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-foreground/50 mb-2">Tested on</div>
                  <div className="space-y-1">
                    {skill.testedOn.map(model => (
                      <div key={model} className="text-sm">
                        {model}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-foreground/50 mb-1">Uses</div>
                  <div className="font-medium">
                    {skill.downloads.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Author Card */}
            <div className="p-6 rounded-lg border border-black/5 bg-foreground/[0.01]">
              <h3 className="font-medium mb-4">About the Author</h3>

              <Link
                to={`/profile/${skill.author.id}`}
                className="group flex items-center gap-3 mb-3"
              >
                <img
                  src={skill.author.avatar}
                  alt={skill.author.name}
                  className="w-12 h-12 rounded-full group-hover:opacity-80 transition-opacity"
                />
                <div>
                  <div className="font-medium group-hover:text-foreground/70 transition-colors">
                    {skill.author.name}
                  </div>
                  <div className="text-sm text-foreground/50">
                    {skill.author.skillsPublished} skills
                  </div>
                </div>
              </Link>

              <p className="text-sm text-foreground/70 leading-relaxed">
                {skill.author.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}