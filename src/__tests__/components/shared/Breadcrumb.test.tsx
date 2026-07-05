import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Breadcrumb from '@/components/shared/Breadcrumb';

describe('Breadcrumb', () => {
  it('renders links and current page label', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Lớp học', href: '/classes' },
          { label: 'Chi tiết' },
        ]}
      />
    );

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Trang chủ' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Lớp học' })).toHaveAttribute('href', '/classes');
    expect(screen.getByText('Chi tiết')).toHaveAttribute('aria-current', 'page');
  });
});
