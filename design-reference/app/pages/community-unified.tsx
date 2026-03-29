import { useState } from "react";
import { Link } from "react-router";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CommunityScore } from "../components/community-score";
import { BadgeDisplay } from "../components/badge-display";
import { Upvote } from "../components/upvote";
import { discussionPosts, skillRequests, showcases } from "../data/community-data";
import { skills } from "../data/mock-data";

type PostType = "all" | "discussion" | "request" | "showcase";
type CategoryFilter = "all" | "general" | "help" | "ideas" | "show-tell";

export default function CommunityUnifiedPage() {
  const [postType, setPostType] = useState<PostType>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");

  // Combine all posts into a unified feed
  const allPosts = [
    ...discussionPosts.map(p => ({ ...p, type: "discussion" as const })),
    ...skillRequests.map(r => ({ ...r, type: "request" as const, category: "help" as const })),
    ...showcases.map(s => ({ ...s, type: "showcase" as const, category: "show-tell" as const }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter posts
  const filteredPosts = allPosts.filter(post => {
    if (postType !== "all" && post.type !== postType) return false;
    if (category !== "all" && post.category !== category) return false;
    return true;
  });

  const categoryLabels = {
    "general": "General",
    "help": "Help",
    "ideas": "Ideas",
    "show-tell": "Show & Tell"
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl mb-2">Community</h1>
          <p className="text-foreground/60 leading-relaxed">
            Discuss skills, request new ones, and share what you've built
          </p>
        </div>

        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Post Type Filter */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Button
          variant={postType === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setPostType("all")}
        >
          All
        </Button>
        <Button
          variant={postType === "discussion" ? "default" : "outline"}
          size="sm"
          onClick={() => setPostType("discussion")}
        >
          Discussions
        </Button>
        <Button
          variant={postType === "request" ? "default" : "outline"}
          size="sm"
          onClick={() => setPostType("request")}
        >
          Requests
        </Button>
        <Button
          variant={postType === "showcase" ? "default" : "outline"}
          size="sm"
          onClick={() => setPostType("showcase")}
        >
          Showcase
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <div className="text-sm text-foreground/50 mr-2">Category:</div>
        <Button
          variant={category === "all" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setCategory("all")}
        >
          All
        </Button>
        <Button
          variant={category === "general" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setCategory("general")}
        >
          General
        </Button>
        <Button
          variant={category === "help" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setCategory("help")}
        >
          Help
        </Button>
        <Button
          variant={category === "ideas" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setCategory("ideas")}
        >
          Ideas
        </Button>
        <Button
          variant={category === "show-tell" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setCategory("show-tell")}
        >
          Show & Tell
        </Button>
      </div>

      {/* Unified Feed */}
      <div className="space-y-3">
        {filteredPosts.map((post, index) => {
          const key = `${post.type}-${post.id || index}`;

          return (
            <div
              key={key}
              className="block p-5 rounded-lg border border-black/5 hover:border-black/15 hover:bg-foreground/[0.01] transition-all"
            >
              <div className="flex items-start gap-4">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-1">
                    <h3 className="font-medium flex-1">{post.title}</h3>
                    
                    {/* Type Badge */}
                    {post.type === "request" && post.status === "fulfilled" && (
                      <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200 flex-shrink-0">
                        Fulfilled
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2 text-sm flex-wrap">
                    <span className="text-foreground/70">{post.author.name}</span>
                    <CommunityScore score={post.author.communityScore} size="sm" />
                    {post.author.badges.length > 0 && (
                      <BadgeDisplay badgeId={post.author.badges[0]} />
                    )}
                  </div>

                  <p className="text-sm text-foreground/70 mb-3 line-clamp-2">
                    {post.type === "discussion" || post.type === "request" 
                      ? (post as any).content || (post as any).description
                      : (post as any).description}
                  </p>

                  {/* Showcase Skills */}
                  {post.type === "showcase" && (post as any).skillsUsed && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {skills
                          .filter(s => (post as any).skillsUsed.includes(s.id))
                          .slice(0, 3)
                          .map(skill => (
                            <Badge key={skill.id} variant="secondary" className="text-xs">
                              {skill.title}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-foreground/50">
                    <Badge variant="secondary" className="text-xs">
                      {categoryLabels[post.category]}
                    </Badge>

                    {post.type === "discussion" && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{(post as any).replies?.length || 0}</span>
                      </div>
                    )}

                    {post.type === "request" && (
                      <>
                        <Badge variant="outline" className="text-xs">
                          {(post as any).domain}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{(post as any).replies?.length || 0}</span>
                        </div>
                      </>
                    )}

                    {(post.type === "discussion" || post.type === "showcase") && (
                      <Upvote initialCount={(post as any).upvotes} size="sm" />
                    )}

                    <span>
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-foreground/50">
            No posts found
          </div>
        )}
      </div>
    </div>
  );
}
