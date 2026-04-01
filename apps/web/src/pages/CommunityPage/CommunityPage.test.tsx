import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/test-utils';
import { mockPost, mockRequest, mockShowcase, mockSkill } from '@/test/mock-data';
import CommunityPage from './CommunityPage';

vi.mock('@/lib/hooks', () => ({
  usePosts: () => ({ data: [mockPost] }),
  useRequests: () => ({ data: [mockRequest] }),
  useShowcases: () => ({ data: [mockShowcase] }),
  useSkills: () => ({ data: { skills: [mockSkill], meta: {} } }),
}));

describe('CommunityPage', () => {
  it('renders page title and subtitle', () => {
    render(<CommunityPage />);
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText("Discuss skills, request new ones, and share what you've built")).toBeInTheDocument();
  });

  it('renders New Post button', () => {
    render(<CommunityPage />);
    expect(screen.getByRole('button', { name: /New Post/i })).toBeInTheDocument();
  });

  it('renders post type filter buttons', () => {
    render(<CommunityPage />);
    // There are two "All" buttons (post type + category), both should exist
    expect(screen.getAllByRole('button', { name: 'All' }).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('button', { name: 'Discussions' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Requests' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Showcase' })).toBeInTheDocument();
  });

  it('renders category filter buttons', () => {
    render(<CommunityPage />);
    expect(screen.getByRole('button', { name: 'General' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Help' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ideas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show & Tell' })).toBeInTheDocument();
  });

  it('renders all post types in feed', () => {
    render(<CommunityPage />);
    expect(screen.getByText('How to handle context window limits?')).toBeInTheDocument();
    expect(screen.getByText('Legal Document Reviewer')).toBeInTheDocument();
    expect(screen.getByText('AI-powered documentation generator')).toBeInTheDocument();
  });

  it('filters by post type when clicked', async () => {
    const user = userEvent.setup();
    render(<CommunityPage />);

    await user.click(screen.getByRole('button', { name: 'Discussions' }));
    expect(screen.getByText('How to handle context window limits?')).toBeInTheDocument();
    expect(screen.queryByText('Legal Document Reviewer')).not.toBeInTheDocument();
    expect(screen.queryByText('AI-powered documentation generator')).not.toBeInTheDocument();
  });

  it('filters by requests type', async () => {
    const user = userEvent.setup();
    render(<CommunityPage />);

    await user.click(screen.getByRole('button', { name: 'Requests' }));
    expect(screen.getByText('Legal Document Reviewer')).toBeInTheDocument();
    expect(screen.queryByText('How to handle context window limits?')).not.toBeInTheDocument();
  });

  it('filters by showcase type', async () => {
    const user = userEvent.setup();
    render(<CommunityPage />);

    await user.click(screen.getByRole('button', { name: 'Showcase' }));
    expect(screen.getByText('AI-powered documentation generator')).toBeInTheDocument();
    expect(screen.queryByText('How to handle context window limits?')).not.toBeInTheDocument();
  });

  it('shows empty state when no posts match filter', async () => {
    const user = userEvent.setup();
    render(<CommunityPage />);

    // Filter to discussions then filter by "Ideas" category — the mock post is "help" category
    await user.click(screen.getByRole('button', { name: 'Discussions' }));
    await user.click(screen.getByRole('button', { name: 'Ideas' }));
    expect(screen.getByText('No posts found')).toBeInTheDocument();
  });

  it('opens new post dialog when New Post is clicked', async () => {
    const user = userEvent.setup();
    render(<CommunityPage />);
    await user.click(screen.getByRole('button', { name: /New Post/i }));
    expect(screen.getByText('Share something with the community')).toBeInTheDocument();
  });

  it('returns to all posts when All filter is clicked', async () => {
    const user = userEvent.setup();
    render(<CommunityPage />);

    await user.click(screen.getByRole('button', { name: 'Discussions' }));
    expect(screen.queryByText('Legal Document Reviewer')).not.toBeInTheDocument();

    // Click the first "All" button (post type filter)
    const allButtons = screen.getAllByRole('button', { name: 'All' });
    await user.click(allButtons[0]);
    expect(screen.getByText('Legal Document Reviewer')).toBeInTheDocument();
  });
});
