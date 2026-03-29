import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Upvote } from "../components/upvote";
import { collections } from "../data/community-data";
import { skills } from "../data/mock-data";

export default function CollectionDetailPage() {
  const { collectionId } = useParams();
  const navigate = useNavigate();

  const collection = collections.find(c => c.id === collectionId);

  if (!collection) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-foreground/50 mb-4">Collection not found</p>
        <Link to="/browse">
          <Button variant="outline">Browse Skills</Button>
        </Link>
      </div>
    );
  }

  const collectionSkills = skills.filter(s => collection.skillIds.includes(s.id));

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

      {/* Collection Header */}
      <div className="mb-8 pb-8 border-b border-black/5">
        <h1 className="text-3xl mb-3">{collection.title}</h1>
        <p className="text-foreground/70 leading-relaxed mb-4 max-w-2xl">
          {collection.description}
        </p>

        <div className="flex items-center gap-4 text-sm">
          <Link
            to={`/profile/${collection.author.id}`}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground"
          >
            <img
              src={collection.author.avatar}
              alt={collection.author.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{collection.author.name}</span>
          </Link>
          <span className="text-foreground/30">•</span>
          <div className="flex items-center gap-1.5 text-foreground/50">
            <Users className="w-4 h-4" />
            <span>{collection.followers} followers</span>
          </div>
          <span className="text-foreground/30">•</span>
          <span className="text-foreground/50">
            {new Date(collection.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-xl mb-4">
          {collectionSkills.length} {collectionSkills.length === 1 ? 'Skill' : 'Skills'}
        </h2>

        <div className="grid gap-4">
          {collectionSkills.map(skill => (
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
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
