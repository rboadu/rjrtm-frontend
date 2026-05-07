import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoadScript from "../sub_pages/LoadScript";

describe("LoadScript data browser", () => {
  it("loads countries from local JSON on mount", async () => {
    render(<LoadScript />);

    expect(await screen.findByText("United States")).toBeInTheDocument();
    expect(screen.getByText("Ghana")).toBeInTheDocument();
    expect(screen.getByText("Canada")).toBeInTheDocument();
  });

  it("shows states when a country row is clicked", async () => {
    render(<LoadScript />);
    await screen.findByText("United States");

    fireEvent.click(screen.getByText("United States"));

    expect(await screen.findByText("California")).toBeInTheDocument();
    expect(screen.getByText("Texas")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
  });

  it("shows cities when a state is clicked", async () => {
    render(<LoadScript />);
    await screen.findByText("United States");

    fireEvent.click(screen.getByText("United States"));
    await screen.findByText("California");

    fireEvent.click(screen.getByText("California"));

    expect(await screen.findByText("Los Angeles")).toBeInTheDocument();
    expect(screen.getByText("San Francisco")).toBeInTheDocument();
  });
});