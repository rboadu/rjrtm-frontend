import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, afterEach } from "vitest";
import NavBar from "../components/navbar";
import App from "../App";

afterEach(() => {
  vi.restoreAllMocks();
});

test("renders navbar links", () => {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );

  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Team")).toBeInTheDocument();
});

test("navbar navigates to Home from Creative Suite page", async () => {
  const user = userEvent.setup();
  vi.stubGlobal("fetch", vi.fn(() =>
    Promise.resolve({ ok: true, json: async () => [] })
  ));

  window.history.pushState({}, "", "/creative-suite");
  render(<App />);

  expect(screen.getByText(/manage city records/i)).toBeInTheDocument();

  const homeLinks = screen.getAllByRole("link", { name: "Home" });
  await user.click(homeLinks[0]);
  expect(window.location.pathname).toBe("/");
});
