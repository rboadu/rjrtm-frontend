import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../components/navbar";

test("Team link is active when visiting /team", () => {
  render(
    <MemoryRouter initialEntries={["/team"]}>
      <NavBar />
    </MemoryRouter>
  );

  const teamLink = screen.getByText("Team");

  expect(teamLink.className).toMatch(/text-white/);
});