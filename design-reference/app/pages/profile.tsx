import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { users, skills } from "../data/mock-data";

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const user = users[userId || ""];

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-foreground/50 mb-4">User not found</p>
        <Link to="/browse">
          <Button variant="outline">Browse Skills</Button>
        </Link>
      </div>
    );
  }

  const userSkills = skills.filter(s => s.author.id === userId);
  const totalDownloads = userSkills.reduce((sum, skill) => sum + skill.downloads, 0);

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

          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="font-medium">{user.skillsPublished}</span>
              <span className="text-foreground/50 ml-1">skills published</span>
            </div>
            <div>
              <span className="font-medium">{totalDownloads.toLocaleString()}</span>
              <span className="text-foreground/50 ml-1">total uses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Published Skills */}
      <div>
        <h2 className="text-2xl mb-6">Published Skills</h2>

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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
