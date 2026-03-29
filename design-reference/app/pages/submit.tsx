import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { domains } from "../data/mock-data";

export default function SubmitPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "",
    tags: "",
    testedOn: "",
    content: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    alert("Skill submitted successfully! (Demo only)");
    navigate("/browse");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const tagList = formData.tags
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

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

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
            <FileText className="w-5 h-5 text-foreground/50" />
          </div>
          <h1 className="text-3xl">Submit a Skill</h1>
        </div>
        <p className="text-foreground/60 leading-relaxed max-w-2xl">
          Share your knowledge with the collective. Write a prompt that teaches AI to excel in a specific domain.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Metadata Section */}
        <div className="p-8 rounded-lg border border-black/5 bg-foreground/[0.01] space-y-6">
          <h2 className="font-medium">Details</h2>

          <div className="space-y-2">
            <Label htmlFor="title">Skill Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Empathetic Email Composition"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              className="border-black/10"
            />
            <p className="text-sm text-foreground/50">
              A clear, descriptive name for your skill
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">One-Line Description *</Label>
            <Input
              id="description"
              type="text"
              placeholder="e.g., Write professional emails that balance clarity with warmth"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              className="border-black/10"
            />
            <p className="text-sm text-foreground/50">
              Summarize what this skill does in one sentence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain *</Label>
              <select
                id="domain"
                value={formData.domain}
                onChange={(e) => handleChange("domain", e.target.value)}
                required
                className="w-full h-10 px-3 rounded-md border border-black/10 bg-background text-base"
              >
                <option value="">Select a domain</option>
                {domains.map(domain => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testedOn">Tested On</Label>
              <Input
                id="testedOn"
                type="text"
                placeholder="e.g., Claude 3.5, GPT-4"
                value={formData.testedOn}
                onChange={(e) => handleChange("testedOn", e.target.value)}
                className="border-black/10"
              />
              <p className="text-sm text-foreground/50">
                Which AI models have you tested this with?
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              type="text"
              placeholder="e.g., writing, communication, workplace"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              className="border-black/10"
            />
            <p className="text-sm text-foreground/50">
              Comma-separated keywords to help others find your skill
            </p>
            {tagList.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tagList.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <Label htmlFor="content">Prompt Content *</Label>
          <Textarea
            id="content"
            placeholder="Write your prompt here...

Example structure:
• What the AI should do
• Key principles or guidelines
• Examples of good outputs
• Common pitfalls to avoid

Make it clear, specific, and actionable."
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            required
            rows={20}
            className="font-mono text-sm leading-relaxed border-black/10 resize-y"
          />
          <p className="text-sm text-foreground/50">
            The actual prompt that will be copied and used with AI models
          </p>
        </div>

        {/* Guidelines */}
        <div className="p-6 rounded-lg bg-foreground/[0.02] border border-black/5">
          <h3 className="font-medium mb-3">Guidelines for Great Skills</h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li className="flex gap-2">
              <span className="text-foreground/40">•</span>
              <span>Be specific about what the AI should do and how</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground/40">•</span>
              <span>Include examples of good outputs when helpful</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground/40">•</span>
              <span>Explain the "why" behind guidelines, not just the "what"</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground/40">•</span>
              <span>Highlight common mistakes or edge cases to avoid</span>
            </li>
            <li className="flex gap-2">
              <span className="text-foreground/40">•</span>
              <span>Test your prompt thoroughly before submitting</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" size="lg">
            Submit Skill
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
