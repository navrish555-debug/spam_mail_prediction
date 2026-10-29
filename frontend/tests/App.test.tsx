import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { App } from '../src/App';

describe('MailGuard AI Frontend', () => {
  it('renders landing page hero title correctly', () => {
    render(<App />);
    expect(screen.getByText(/Spam & Threat Defense/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In & Scan Email/i)).toBeInTheDocument();
    expect(screen.getByText(/^Sign In$/i)).toBeInTheDocument();
  });

  it('renders empirical benchmark section on landing page', () => {
    render(<App />);
    expect(screen.getByText(/Empirical Benchmarks/i)).toBeInTheDocument();
  });
});
