import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CommunityScore } from "../components/community-score";
import { BadgeShelf } from "../components/badge-display";
import { Upvote } from "../components/upvote";
import { currentUser, collections } from "../data/community-data";
import { skills } from "../data/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function ProfileEnhancedPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const isOwnProfile = userId === currentUser.id;

  // For demo, just use currentUser
  const user = currentUser;

  const userSkills = skills.filter(s => s.author.id === userId);
  const userCollections = collections.filter(c => c.author.id === userId);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-8 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Profile Header */}
      <div className="flex items-start gap-6 pb-8 mb-8 border-b border-black/5">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-full"
        />

        <div className="flex-1">
          <h1 className="text-3xl mb-2">{user.name}</h1>
          <p className="text-foreground/70 leading-relaxed mb-4 max-w-2xl">
            {user.bio}
          </p>

          {/* Community Score */}
          <div className="mb-4">
            <CommunityScore score={user.communityScore} size="lg" />
          </div>

          {/* Badge Shelf */}
          <div className="mb-4">
            <BadgeShelf badgeIds={user.badges} />
          </div>

          {/* Token Balance (own profile only) */}
          {isOwnProfile && (
            <div className="text-sm text-foreground/50">
              <span className="font-medium">{user.tokens}</span> tokens available
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="skills">
        <TabsList className="mb-6">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Skills Tab */}
        <TabsContent value="skills">
          {userSkills.length === 0 ? (
            <div className="text-center py-12 text-foreground/50">
              No skills published yet
            </div>
          ) : (
            <div className="grid gap-4">
              {userSkills.map(skill => (
                <Link
                  key={skill.id}
                  to={`/skill/${skill.id}`}
                  className="group block p-6 rounded-lg border border-black/5 hover:border-black/15 hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-medium flex-1 group-hover:text-foreground/80 transition-colors">
                      {skill.title}
                    </h3>
                    <Badge variant="outline" className="flex-shrink-0">
                      {skill.domain}
                    </Badge>
                  </div>

                  <p className="text-foreground/70 leading-relaxed mb-4">
                    {skill.description}
                  </p>

                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex flex-wrap gap-2">
                      {skill.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 ml-auto text-sm text-foreground/50">
                      <Upvote initialCount={skill.upvotes} size="sm" />
                      <span>{skill.downloads.toLocaleString()} uses</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Collections Tab */}
        <TabsContent value="collections">
          {userCollections.length === 0 ? (
            <div className="text-center py-12 text-foreground/50">
              No collections created yet
            </div>
          ) : (
            <div className="grid gap-4">
              {userCollections.map(collection => (
                <Link
                  key={collection.id}
                  to={`/collection/${collection.id}`}
                  className="group block p-6 rounded-lg border border-black/5 hover:border-black/15 hover:shadow-sm transition-all bg-white"
                >
                  <h3 className="font-medium mb-2 group-hover:text-foreground/80 transition-colors">
                    {collection.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed mb-3">
                    {collection.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-foreground/50">
                    <span>{collection.skillIds.length} skills</span>
                    <span>•</span>
                    <span>{collection.followers} followers</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <div className="space-y-4">
            <div className="p-6 rounded-lg border border-black/5 bg-foreground/[0.01]">
              <div className="text-sm text-foreground/50 mb-1">
                {new Date("2026-03-12").toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-foreground/70">
                Contributed to <Link to="/skill/4" className="font-medium text-foreground hover:text-foreground/70">React Component Code Reviewer</Link>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-black/5 bg-foreground/[0.01]">
              <div className="text-sm text-foreground/50 mb-1">
                {new Date("2026-03-10").toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-foreground/70">
                Received upvote on <Link to="/skill/6" className="font-medium text-foreground hover:text-foreground/70">Design System Auditor</Link>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
