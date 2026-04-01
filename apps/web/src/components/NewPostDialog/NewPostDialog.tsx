import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog/Dialog';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Textarea } from '@/components/ui/Textarea/Textarea';
import { Badge } from '@/components/ui/Badge/Badge';
import { SuccessCheckmark } from '@/components/SuccessCheckmark/SuccessCheckmark';
import api from '@/lib/api';
import styles from './NewPostDialog.module.scss';

type NewPostType = 'discussion' | 'request' | 'showcase';

interface NewPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryOptions = [
  { value: 'GENERAL', label: 'General' },
  { value: 'HELP', label: 'Help' },
  { value: 'IDEAS', label: 'Ideas' },
  { value: 'SHOW_AND_TELL', label: 'Show & Tell' },
];

export function NewPostDialog({ open, onOpenChange }: NewPostDialogProps) {
  const queryClient = useQueryClient();
  const [postType, setPostType] = useState<NewPostType>('discussion');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [skillIds, setSkillIds] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const reset = () => {
    setTitle('');
    setBody('');
    setCategory('GENERAL');
    setSkillIds('');
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    queryClient.invalidateQueries({ queryKey: ['requests'] });
    queryClient.invalidateQueries({ queryKey: ['showcases'] });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      reset();
      onOpenChange(false);
    }, 1400);
  };

  const handleError = (err: any) => {
    alert(err.response?.data?.message || 'Failed to create post. Are you logged in?');
  };

  const createPost = useMutation({
    mutationFn: () => api.post('/community/posts', { title: title || undefined, body, category }),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const createRequest = useMutation({
    mutationFn: () => api.post('/requests', { title, description: body }),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const createShowcase = useMutation({
    mutationFn: () => {
      const ids = skillIds.split(',').map(s => s.trim()).filter(Boolean);
      return api.post('/showcases', { title, description: body, skillIds: ids });
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const isSubmitting = createPost.isPending || createRequest.isPending || createShowcase.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postType === 'discussion') createPost.mutate();
    else if (postType === 'request') createRequest.mutate();
    else createShowcase.mutate();
  };

  const isValid =
    postType === 'discussion' ? body.trim().length > 0 :
    postType === 'request' ? title.trim().length > 0 && body.trim().length > 0 :
    title.trim().length > 0 && body.trim().length > 0;

  return (
    <>
    <SuccessCheckmark visible={showSuccess} label="Posted!" />
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Post</DialogTitle>
          <DialogDescription>Share something with the community</DialogDescription>
        </DialogHeader>

        {/* Post Type Tabs */}
        <div className={styles.typeTabs}>
          {(['discussion', 'request', 'showcase'] as NewPostType[]).map(type => (
            <button
              key={type}
              type="button"
              className={`${styles.typeTab} ${postType === type ? styles.typeTabActive : ''}`}
              onClick={() => setPostType(type)}
            >
              {type === 'discussion' ? 'Discussion' : type === 'request' ? 'Request' : 'Showcase'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Title — optional for discussions, required for request/showcase */}
          <div className={styles.field}>
            <label htmlFor="newpost-title" className={styles.label}>
              Title {postType === 'discussion' && <span className={styles.optional}>(optional)</span>}
            </label>
            <Input
              id="newpost-title"
              type="text"
              placeholder={
                postType === 'discussion' ? 'Give your post a title' :
                postType === 'request' ? 'What skill are you looking for?' :
                'What did you build?'
              }
              value={title}
              onChange={e => setTitle(e.target.value)}
              required={postType !== 'discussion'}
            />
          </div>

          {/* Body */}
          <div className={styles.field}>
            <label htmlFor="newpost-body" className={styles.label}>
              {postType === 'discussion' ? 'Content' : 'Description'}
            </label>
            <Textarea
              id="newpost-body"
              placeholder={
                postType === 'discussion' ? 'What would you like to discuss?' :
                postType === 'request' ? 'Describe the skill you need...' :
                'Tell the community about your project...'
              }
              value={body}
              onChange={e => setBody(e.target.value)}
              required
              rows={5}
            />
          </div>

          {/* Category — discussions only */}
          {postType === 'discussion' && (
            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <div className={styles.categoryPicker}>
                {categoryOptions.map(opt => (
                  <Badge
                    key={opt.value}
                    variant={category === opt.value ? 'default' : 'secondary'}
                    className={styles.categoryBadge}
                    onClick={() => setCategory(opt.value)}
                  >
                    {opt.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Skill IDs — showcases only */}
          {postType === 'showcase' && (
            <div className={styles.field}>
              <label htmlFor="newpost-skills" className={styles.label}>Skills Used</label>
              <Input
                id="newpost-skills"
                type="text"
                placeholder="Paste skill IDs, comma-separated"
                value={skillIds}
                onChange={e => setSkillIds(e.target.value)}
              />
              <p className={styles.hint}>IDs of SkillBrick AI skills you used in your project</p>
            </div>
          )}

          <div className={styles.actions}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
