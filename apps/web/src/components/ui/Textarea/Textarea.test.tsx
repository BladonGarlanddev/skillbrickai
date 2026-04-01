import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/test/test-utils';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders with placeholder', () => {
    render(<Textarea placeholder="Write here..." />);
    expect(screen.getByPlaceholderText('Write here...')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} placeholder="text" />);
    await user.type(screen.getByPlaceholderText('text'), 'test content');
    expect(onChange).toHaveBeenCalled();
  });

  it('respects rows attribute', () => {
    render(<Textarea rows={10} placeholder="rows" />);
    expect(screen.getByPlaceholderText('rows')).toHaveAttribute('rows', '10');
  });
});
