import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// mock react-leaflet so Leaflet internals don't run in JSDOM
vi.mock("react-leaflet", () => {
  const React = require("react");
  return {
    MapContainer: ({ children }) => React.createElement("div", { "data-testid": "map-container" }, children),
    TileLayer: () => React.createElement("div", { "data-testid": "tile-layer" }),
    Marker: ({ children }) => React.createElement("div", { "data-testid": "marker" }, children),
    Popup: ({ children }) => React.createElement("div", { "data-testid": "popup" }, children),
    useMapEvents: () => () => null,
  };
});

import WorldMap from "../components/worldMap";

describe("WorldMap", () => {
  it("renders a map container, tile layer and marker popup for selectedPosition", () => {
    render(<WorldMap selectedPosition={{ lat: 10, lng: 20 }} onLocationSelect={() => {}} />);

    expect(screen.getByTestId("map-container")).toBeInTheDocument();
    expect(screen.getByTestId("tile-layer")).toBeInTheDocument();
    // marker + popup render because we passed selectedPosition
    expect(screen.getByTestId("marker")).toBeInTheDocument();
    expect(screen.getByTestId("popup")).toBeInTheDocument();
    expect(screen.getByText(/your selection/i)).toBeInTheDocument();
  });
});