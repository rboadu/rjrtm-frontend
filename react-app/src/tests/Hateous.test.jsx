import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, afterEach, expect } from "vitest";
import LoadScript from "../sub_pages/LoadScript";

describe("LoadScript HATEOAS dropdowns", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads countries then states and cities using HATEOAS links", async () => {
    const fakeFetch = vi.fn((input, init) => {
      // normalize input to a URL string (handles Request objects and init)
      let raw = "";
      if (typeof input === "string") raw = input;
      else if (input && (input.url || input instanceof Request)) raw = input.url || String(input);
      else raw = String(input);
      if (init && init.url) raw = init.url;
      const url = String(raw).toLowerCase();

      // helpful for debugging when test times out
      console.log("fakeFetch called with:", raw);

      if (url.includes("countries")) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              name: "Country A",
              code: "A",
              _links: { states: { href: "/states?country=A" } },
            },
          ],
        });
      }
      if (url.includes("states?country=a")) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              name: "State X",
              code: "X",
              _links: { cities: { href: "/cities?state=X" } },
            },
          ],
        });
      }
      if (url.includes("cities?state=x")) {
        return Promise.resolve({
          ok: true,
          json: async () => [{ name: "City 1", id: "c1" }],
        });
      }
      return Promise.resolve({ ok: false, status: 404, text: async () => "not found" });
    });

    vi.stubGlobal("fetch", fakeFetch);

    render(<LoadScript />);

    // wait for the country text to appear in the DOM
    await screen.findByText(/country a/i);
    const countrySelect = screen.getByLabelText("Country");
    fireEvent.change(countrySelect, { target: { value: "A" } });

    // wait for state text to appear
    await screen.findByText(/state x/i);
    const stateSelect = screen.getByLabelText("State");
    fireEvent.change(stateSelect, { target: { value: "X" } });

    // wait for city text to appear
    await screen.findByText(/city 1/i);

    // verify fetch was called for countries, states and cities
    const calledUrls = fakeFetch.mock.calls.map(([input, init]) => {
      if (typeof input === "string") return input.toLowerCase();
      if (input && input.url) return String(input.url).toLowerCase();
      if (init && init.url) return String(init.url).toLowerCase();
      return String(input).toLowerCase();
    });

    expect(calledUrls.some((u) => u.includes("countries"))).toBe(true);
    expect(calledUrls.some((u) => u.includes("states?country=a"))).toBe(true);
    expect(calledUrls.some((u) => u.includes("cities?state=x"))).toBe(true);
  });
});