import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../components/navbar";
import App from "../App";

test("renders navbar links", () => {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );

  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Team")).toBeInTheDocument();
});

test("navbar still navigates after using creative suite actions", async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/creative-suite");

  render(<App />);

  await user.click(screen.getByRole("button", { name: "Create" }));
  expect(screen.getByPlaceholderText("Enter new item...")).toBeInTheDocument();

  await user.click(screen.getByRole("link", { name: "Home" }));
  expect(window.location.pathname).toBe("/");
});
