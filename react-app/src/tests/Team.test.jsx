import React from 'react';
import { render, screen } from '@testing-library/react';
import Team from '../sub_pages/Team';

import { vi } from "vitest";

vi.mock("../components/profile_card", () => ({
  default: ({ name, bio }) => (
    <div>
      <h3>{name}</h3>
      <p>{bio}</p>
    </div>
  ),
}));

describe('Team Component', () => {
  test('renders team title', () => {
    render(<Team />);
    const titleElement = screen.getByText(/Senior Design Team/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders team member profiles', () => {
    render(<Team />);
    const memberElements = screen.getAllByRole('heading', { level: 3 });
    expect(memberElements.length).toBeGreaterThan(0);
  });

  test('renders team member bios', () => {
    render(<Team />);
    const bioElement = screen.getByText(/A computer science major passionate about exploring the depths of software development and thoughtful design./i);
    expect(bioElement).toBeInTheDocument();
  });
});