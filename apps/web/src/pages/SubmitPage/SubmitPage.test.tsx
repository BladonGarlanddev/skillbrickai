import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/test-utils';
import SubmitPage from './SubmitPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('@/lib/hooks', () => ({
  useDomains: () => ({ data: ['Writing', 'Code Review', 'Research'] }),
}));

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

describe('SubmitPage', () => {
  it('renders page title', () => {
    render(<SubmitPage />);
    expect(screen.getByText('Submit a Skill')).toBeInTheDocument();
  });

  it('renders all required form fields', () => {
    render(<SubmitPage />);
    expect(screen.getByLabelText(/Skill Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/One-Line Description/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Domain/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prompt Content/)).toBeInTheDocument();
  });

  it('renders optional fields', () => {
    render(<SubmitPage />);
    expect(screen.getByLabelText(/Tags/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tested On/)).toBeInTheDocument();
  });

  it('renders domain options from hook', () => {
    render(<SubmitPage />);
    const select = screen.getByLabelText(/Domain/) as HTMLSelectElement;
    const options = Array.from(select.options).map(o => o.text);
    expect(options).toContain('Writing');
    expect(options).toContain('Code Review');
    expect(options).toContain('Research');
  });

  it('renders submit and cancel buttons', () => {
    render(<SubmitPage />);
    expect(screen.getByRole('button', { name: /Submit Skill/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('renders guidelines section', () => {
    render(<SubmitPage />);
    expect(screen.getByText('Guidelines for Great Skills')).toBeInTheDocument();
  });

  it('shows tag preview when tags are entered', async () => {
    const user = userEvent.setup();
    render(<SubmitPage />);
    const tagsInput = screen.getByLabelText(/Tags/);
    await user.type(tagsInput, 'react, typescript');
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('allows filling in all form fields', async () => {
    const user = userEvent.setup();
    render(<SubmitPage />);

    await user.type(screen.getByLabelText(/Skill Title/), 'My Skill');
    await user.type(screen.getByLabelText(/One-Line Description/), 'A test skill');
    await user.selectOptions(screen.getByLabelText(/Domain/), 'Writing');
    await user.type(screen.getByLabelText(/Prompt Content/), 'You are a helpful assistant');

    expect(screen.getByLabelText(/Skill Title/)).toHaveValue('My Skill');
    expect(screen.getByLabelText(/One-Line Description/)).toHaveValue('A test skill');
    expect(screen.getByLabelText(/Domain/)).toHaveValue('Writing');
    expect(screen.getByLabelText(/Prompt Content/)).toHaveValue('You are a helpful assistant');
  });

  it('renders back button', () => {
    render(<SubmitPage />);
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
  });
});
