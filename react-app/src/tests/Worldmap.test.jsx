import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, vi, afterEach, expect } from "vitest";

// Mock react-leaflet to avoid real DOM map rendering
vi.mock("react-leaflet", () => {
  return {
    __esModule: true,
    MapContainer: ({ children }) => <div data-testid="map">{children}</div>,
    TileLayer: () => <div data-testid="tile" />,
  };
});

import WorldMap from "../components/worldMap";

describe("WorldMap", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a map container and tile layer", () => {
    render(<WorldMap />);
    expect(screen.getByTestId("map")).toBeInTheDocument();
    expect(screen.getByTestId("tile")).toBeInTheDocument();
  });
});