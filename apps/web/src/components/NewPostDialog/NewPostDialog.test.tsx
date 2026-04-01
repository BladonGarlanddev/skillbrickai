import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/test-utils';
import { NewPostDialog } from './NewPostDialog';

vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: {} }),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

describe('NewPostDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
  };

  it('renders dialog title and description', () => {
    render(<NewPostDialog {...defaultProps} />);
    expect(screen.getByText('New Post')).toBeInTheDocument();
    expect(screen.getByText('Share something with the community')).toBeInTheDocument();
  });

  it('renders post type tabs', () => {
    render(<NewPostDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Discussion' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Showcase' })).toBeInTheDocument();
  });

  it('renders discussion form fields by default', () => {
    render(<NewPostDialog {...defaultProps} />);
    expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Content/)).toBeInTheDocument();
    expect(screen.getByText('General')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Ideas')).toBeInTheDocument();
  });

  it('shows title as optional for discussions', () => {
    render(<NewPostDialog {...defaultProps} />);
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('switches to request form', async () => {
    const user = userEvent.setup();
    render(<NewPostDialog {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'Request' }));
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(screen.queryByText('(optional)')).not.toBeInTheDocument();
    expect(screen.queryByText('General')).not.toBeInTheDocument();
  });

  it('switches to showcase form', async () => {
    const user = userEvent.setup();
    render(<NewPostDialog {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'Showcase' }));
    expect(screen.getByLabelText(/Skills Used/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
  });

  it('renders cancel and post buttons', () => {
    render(<NewPostDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Post' })).toBeInTheDocument();
  });

  it('disables Post button when form is empty', () => {
    render(<NewPostDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Post' })).toBeDisabled();
  });

  it('enables Post button when discussion body is filled', async () => {
    const user = userEvent.setup();
    render(<NewPostDialog {...defaultProps} />);
    await user.type(screen.getByLabelText(/Content/), 'Some discussion content');
    expect(screen.getByRole('button', { name: 'Post' })).toBeEnabled();
  });

  it('requires title for request type', async () => {
    const user = userEvent.setup();
    render(<NewPostDialog {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'Request' }));
    // Only fill description, not title
    await user.type(screen.getByLabelText(/Description/), 'Need a skill');
    expect(screen.getByRole('button', { name: 'Post' })).toBeDisabled();
  });

  it('enables Post when request has title and description', async () => {
    const user = userEvent.setup();
    render(<NewPostDialog {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: 'Request' }));
    await user.type(screen.getByPlaceholderText('What skill are you looking for?'), 'SQL Optimizer');
    await user.type(screen.getByLabelText(/Description/), 'Need a skill for SQL');
    expect(screen.getByRole('button', { name: 'Post' })).toBeEnabled();
  });

  it('calls onOpenChange when cancel is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<NewPostDialog open={true} onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not render when open is false', () => {
    render(<NewPostDialog open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByText('New Post')).not.toBeInTheDocument();
  });
});
