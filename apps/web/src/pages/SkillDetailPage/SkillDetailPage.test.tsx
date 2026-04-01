import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, userEvent } from '@/test/test-utils';
import { mockSkill } from '@/test/mock-data';
import SkillDetailPage from './SkillDetailPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ skillId: 'skill-1' }),
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/lib/hooks', () => ({
  useSkill: (id: string) => ({
    data: id === 'skill-1' ? mockSkill : null,
    isLoading: false,
  }),
}));

describe('SkillDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders skill title', () => {
    render(<SkillDetailPage />);
    expect(screen.getByText('Empathetic Email Composition')).toBeInTheDocument();
  });

  it('renders skill description', () => {
    render(<SkillDetailPage />);
    expect(screen.getByText('Write professional emails that balance clarity with warmth')).toBeInTheDocument();
  });

  it('renders author info', () => {
    render(<SkillDetailPage />);
    expect(screen.getAllByText('Jane Doe').length).toBeGreaterThanOrEqual(1);
  });

  it('renders skill content', () => {
    render(<SkillDetailPage />);
    expect(screen.getByText('You are an expert email writer...')).toBeInTheDocument();
  });

  it('renders Copy Prompt button', () => {
    render(<SkillDetailPage />);
    expect(screen.getByRole('button', { name: /Copy Prompt/i })).toBeInTheDocument();
  });

  it('renders Download button', () => {
    render(<SkillDetailPage />);
    expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
  });

  it('renders sidebar details', () => {
    render(<SkillDetailPage />);
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Writing')).toBeInTheDocument();
    expect(screen.getByText('writing')).toBeInTheDocument();
    expect(screen.getByText('Claude 3.5')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders about the author section', () => {
    render(<SkillDetailPage />);
    expect(screen.getByText('About the Author')).toBeInTheDocument();
    expect(screen.getByText('5 skills')).toBeInTheDocument();
  });

  it('renders tags', () => {
    render(<SkillDetailPage />);
    expect(screen.getByText('communication')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
  });

  it('renders back button', () => {
    render(<SkillDetailPage />);
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
  });

  it('copies content to clipboard on copy click', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    render(<SkillDetailPage />);
    await user.click(screen.getByRole('button', { name: /Copy Prompt/i }));
    expect(writeText).toHaveBeenCalledWith('You are an expert email writer...');
  });
});
