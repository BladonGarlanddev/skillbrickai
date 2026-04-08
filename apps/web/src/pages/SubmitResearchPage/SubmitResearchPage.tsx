import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, BookOpen, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Badge } from '@/components/ui/Badge/Badge';
import { SuccessCheckmark } from '@/components/SuccessCheckmark/SuccessCheckmark';
import { useDomains } from '@/lib/hooks';
import api from '@/lib/api';
import styles from './SubmitResearchPage.module.scss';

interface SourceEntry {
  title: string;
  url: string;
  description: string;
}

export default function SubmitResearchPage() {
  const navigate = useNavigate();
  const { data: domains } = useDomains();
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    tags: '',
    content: '',
    methodology: '',
    keyFindings: '',
    originalAuthorName: '',
    originalAuthorUrl: '',
    sourceUrl: '',
  });
  const [sources, setSources] = useState<SourceEntry[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      const validSources = sources.filter(s => s.title.trim());
      await api.post('/research', {
        name: formData.title,
        description: formData.description,
        domain: formData.domain,
        content: formData.content,
        tags: tags.length > 0 ? tags : undefined,
        sources: validSources.length > 0
          ? validSources.map(s => ({
              title: s.title,
              url: s.url || undefined,
              description: s.description || undefined,
            }))
          : undefined,
        methodology: formData.methodology || undefined,
        keyFindings: formData.keyFindings || undefined,
        originalAuthorName: formData.originalAuthorName || undefined,
        originalAuthorUrl: formData.originalAuthorUrl || undefined,
        sourceUrl: formData.sourceUrl || undefined,
      });
      setShowSuccess(true);
      setTimeout(() => navigate('/browse?type=research'), 1400);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit research. Are you logged in?');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSource = () => {
    setSources(prev => [...prev, { title: '', url: '', description: '' }]);
  };

  const updateSource = (index: number, field: keyof SourceEntry, value: string) => {
    setSources(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const removeSource = (index: number) => {
    setSources(prev => prev.filter((_, i) => i !== index));
  };

  const tagList = formData.tags
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  return (
    <div className={styles.page}>
      <Helmet>
        <title>Submit Research | SkillBrick AI</title>
        <meta name="description" content="Share raw insights, findings, and analysis on SkillBrick AI. Research preserves nuance and reasoning for others to learn from." />
        <link rel="canonical" href="https://skillbrickai.com/submit-research" />
      </Helmet>

      <SuccessCheckmark visible={showSuccess} label="Research Submitted!" />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className={styles.backButton}
      >
        <ArrowLeft style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
        Back
      </Button>

      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <BookOpen style={{ width: '1.25rem', height: '1.25rem', color: 'rgba(10,10,10,0.5)' }} />
        </div>
        <div>
          <h1 className={styles.title}>Submit Research</h1>
          <p className={styles.subtitle}>
            Share raw insights, findings, and analysis. Research is like putty — it preserves nuance and reasoning for others to shape into their own solutions.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Metadata Section */}
        <div className={styles.metadataSection}>
          <h2 className={styles.sectionTitle}>Details</h2>

          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>Research Title *</label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Effective Prompt Patterns for Code Review"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
            <p className={styles.fieldHint}>A clear, descriptive name for your research</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>One-Line Description *</label>
            <Input
              id="description"
              type="text"
              placeholder="e.g., Analysis of which prompt structures yield the most thorough code reviews"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
            <p className={styles.fieldHint}>Summarize the research focus in one sentence</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="domain" className={styles.label}>Domain *</label>
            <select
              id="domain"
              value={formData.domain}
              onChange={(e) => handleChange('domain', e.target.value)}
              required
              className={styles.select}
            >
              <option value="">Select a domain</option>
              {(domains ?? []).map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="tags" className={styles.label}>Tags</label>
            <Input
              id="tags"
              type="text"
              placeholder="e.g., prompting, code-review, analysis"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
            />
            <p className={styles.fieldHint}>Comma-separated keywords to help others find your research</p>
            {tagList.length > 0 && (
              <div className={styles.tagPreview}>
                {tagList.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sources Section */}
        <div className={styles.metadataSection}>
          <h2 className={styles.sectionTitle}>Sources (Optional)</h2>
          <p className={styles.sectionSubtitle}>
            Reference the materials, papers, or URLs that informed your research.
          </p>

          {sources.map((source, index) => (
            <div key={index} className={styles.sourceEntry}>
              <div className={styles.field}>
                <label className={styles.label}>Source Title *</label>
                <Input
                  type="text"
                  placeholder="e.g., Chain-of-Thought Prompting Paper"
                  value={source.title}
                  onChange={(e) => updateSource(index, 'title', e.target.value)}
                />
              </div>
              <div className={styles.sourceEntryRow}>
                <div className={styles.field}>
                  <label className={styles.label}>URL</label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={source.url}
                    onChange={(e) => updateSource(index, 'url', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <Input
                    type="text"
                    placeholder="Brief note about this source"
                    value={source.description}
                    onChange={(e) => updateSource(index, 'description', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.sourceActions}>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSource(index)}>
                  <X style={{ width: '0.875rem', height: '0.875rem' }} />
                  Remove
                </Button>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" size="sm" onClick={addSource}>
            <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
            Add Source
          </Button>
        </div>

        {/* Attribution Section */}
        <div className={styles.metadataSection}>
          <h2 className={styles.sectionTitle}>Attribution (Optional)</h2>
          <p className={styles.sectionSubtitle}>
            If this research was originally created by someone else, give them credit here.
          </p>

          <div className={styles.field}>
            <label htmlFor="originalAuthorName" className={styles.label}>Original Author Name</label>
            <Input
              id="originalAuthorName"
              type="text"
              placeholder="e.g., GitHub username or real name"
              value={formData.originalAuthorName}
              onChange={(e) => handleChange('originalAuthorName', e.target.value)}
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="originalAuthorUrl" className={styles.label}>Author URL</label>
              <Input
                id="originalAuthorUrl"
                type="url"
                placeholder="e.g., https://github.com/username"
                value={formData.originalAuthorUrl}
                onChange={(e) => handleChange('originalAuthorUrl', e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="sourceUrl" className={styles.label}>Source URL</label>
              <Input
                id="sourceUrl"
                type="url"
                placeholder="e.g., https://arxiv.org/abs/..."
                value={formData.sourceUrl}
                onChange={(e) => handleChange('sourceUrl', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={styles.field}>
          <label htmlFor="content" className={styles.label}>Research Content *</label>
          <Textarea
            id="content"
            placeholder={`Write your research here...

This is the main body of your research. Include:
\u2022 Your observations, insights, and findings
\u2022 Context and background
\u2022 Analysis and reasoning
\u2022 Nuances and edge cases

Write naturally — this is raw knowledge, not a prescriptive instruction.`}
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            required
            rows={20}
            className={styles.contentTextarea}
          />
          <p className={styles.fieldHint}>The main body of your research — insights, findings, and analysis</p>
        </div>

        {/* Optional structured sections */}
        <div className={styles.metadataSection}>
          <h2 className={styles.sectionTitle}>Structured Sections (Optional)</h2>
          <p className={styles.sectionSubtitle}>
            Add optional structured sections to help readers navigate your research.
          </p>

          <div className={styles.field}>
            <label htmlFor="methodology" className={styles.label}>Methodology</label>
            <Textarea
              id="methodology"
              placeholder="How did you arrive at these findings? What approach did you take?"
              value={formData.methodology}
              onChange={(e) => handleChange('methodology', e.target.value)}
              rows={6}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="keyFindings" className={styles.label}>Key Findings</label>
            <Textarea
              id="keyFindings"
              placeholder="What are the most important takeaways? Summarize the key insights."
              value={formData.keyFindings}
              onChange={(e) => handleChange('keyFindings', e.target.value)}
              rows={6}
            />
          </div>
        </div>

        {/* Guidelines */}
        <div className={styles.guidelines}>
          <h3 className={styles.guidelinesTitle}>Guidelines for Great Research</h3>
          <ul className={styles.guidelinesList}>
            <li>
              <span className={styles.bullet}>{'\u2022'}</span>
              <span>Preserve nuance — don't oversimplify for the sake of brevity</span>
            </li>
            <li>
              <span className={styles.bullet}>{'\u2022'}</span>
              <span>Include the reasoning and context behind your findings</span>
            </li>
            <li>
              <span className={styles.bullet}>{'\u2022'}</span>
              <span>Cite your sources when building on others' work</span>
            </li>
            <li>
              <span className={styles.bullet}>{'\u2022'}</span>
              <span>Note limitations, edge cases, and areas for further exploration</span>
            </li>
            <li>
              <span className={styles.bullet}>{'\u2022'}</span>
              <span>Think of this as sharing knowledge others can shape into their own tools</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Research'}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
