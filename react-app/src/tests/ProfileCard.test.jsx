import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProfileCard from "../components/profile_card";

describe("ProfileCard", () => {
  it("renders provided name and bio", () => {
    render(<ProfileCard name="Alice" bio="Engineer" />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
  });

  it("renders default bio when none provided", () => {
    render(<ProfileCard name="Bob" />);
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText(/No bio provided\./i)).toBeInTheDocument();
  });
});