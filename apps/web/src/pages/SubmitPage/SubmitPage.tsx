import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Badge } from '@/components/ui/Badge/Badge';
import { useDomains } from '@/lib/hooks';
import api from '@/lib/api';
import styles from './SubmitPage.module.scss';

export default function SubmitPage() {
  const navigate = useNavigate();
  const { data: domains } = useDomains();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    tags: '',
    testedOn: '',
    content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      const testedOn = formData.testedOn.split(',').map(t => t.trim()).filter(Boolean);
      await api.post('/skills', {
        name: formData.title,
        description: formData.description,
        domain: formData.domain,
        content: formData.content,
        tags: tags.length > 0 ? tags : undefined,
        testedOn: testedOn.length > 0 ? testedOn : undefined,
      });
      navigate('/browse');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit skill. Are you logged in?');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const tagList = formData.tags
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  return (
    <div className={styles.page}>
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
          <FileText style={{ width: '1.25rem', height: '1.25rem', color: 'rgba(10,10,10,0.5)' }} />
        </div>
        <div>
          <h1 className={styles.title}>Submit a Skill</h1>
          <p className={styles.subtitle}>
            Share your knowledge with the collective. Write a prompt that teaches AI to excel in a specific domain.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Metadata Section */}
        <div className={styles.metadataSection}>
          <h2 className={styles.sectionTitle}>Details</h2>

          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>Skill Title *</label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Empathetic Email Composition"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
            <p className={styles.fieldHint}>A clear, descriptive name for your skill</p>
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>One-Line Description *</label>
            <Input
              id="description"
              type="text"
              placeholder="e.g., Write professional emails that balance clarity with warmth"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
            <p className={styles.fieldHint}>Summarize what this skill does in one sentence</p>
          </div>

          <div className={styles.fieldRow}>
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
              <label htmlFor="testedOn" className={styles.label}>Tested On</label>
              <Input
                id="testedOn"
                type="text"
                placeholder="e.g., Claude 3.5, GPT-4"
                value={formData.testedOn}
                onChange={(e) => handleChange('testedOn', e.target.value)}
              />
              <p className={styles.fieldHint}>Which AI models have you tested this with?</p>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="tags" className={styles.label}>Tags</label>
            <Input
              id="tags"
              type="text"
              placeholder="e.g., writing, communication, workplace"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
            />
            <p className={styles.fieldHint}>Comma-separated keywords to help others find your skill</p>
            {tagList.length > 0 && (
              <div className={styles.tagPreview}>
                {tagList.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className={styles.field}>
          <label htmlFor="content" className={styles.label}>Prompt Content *</label>
          <Textarea
            id="content"
            placeholder={`Write your prompt here...

Example structure:
\u2022 What the AI should do
\u2022 Key principles or guidelines
\u2022 Examples of good outputs
\u2022 Common pitfalls to avoid

Make it clear, specific, and actionable.`}
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            required
            rows={20}
            className={styles.contentTextarea}
          />
          <p className={styles.fieldHint}>The actual prompt that will be copied and used with AI models</p>
        </div>

        {/* Guidelines */}
        <div className={styles.guidelines}>
          <h3 className={styles.guidelinesTitle}>Guidelines for Great Skills</h3>
          <ul className={styles.guidelinesList}>
            <li>
              <span className={styles.bullet}>{'\u2022'}</span>
              <span>Be specific about what the AI should do and how</span>
            </li>
            <li>
              <span className={styles.bullet}>{'\u2022'}</span>
              <span>Include examples of good outputs when helpful</span>
            </li>
            <li>
              <span className={styles.bullet}>{'\u2022'}</span>
              <span>Explain the "why" behind guidelines, not just the "what"</span>
            </li>
            <li>
              <span className={styles.bullet}>{'\u2022'}</span>
              <span>Highlight common mistakes or edge cases to avoid</span>
            </li>
            <li>
              <span className={styles.bullet}>{'\u2022'}</span>
              <span>Test your prompt thoroughly before submitting</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Skill'}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
