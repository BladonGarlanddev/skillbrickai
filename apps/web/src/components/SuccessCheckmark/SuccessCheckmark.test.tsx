import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { SuccessCheckmark } from './SuccessCheckmark';

describe('SuccessCheckmark', () => {
  it('renders label when visible', () => {
    render(<SuccessCheckmark visible={true} label="Success!" />);
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  it('renders default label', () => {
    render(<SuccessCheckmark visible={true} />);
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    render(<SuccessCheckmark visible={false} label="Hidden" />);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('renders SVG checkmark', () => {
    const { container } = render(<SuccessCheckmark visible={true} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('path')).toBeInTheDocument();
  });
});
