import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExperienceDotsVisualization from "../ExperienceDotsVisualization";

const focusRegion = () => {
  const region = screen.getByTestId("compass-keyboard-region");
  region.focus();
  return region;
};

describe("ExperienceDotsVisualization keyboard navigation", () => {
  it.each([
    ["{ArrowRight}", "Sovereignty"],
    ["{ArrowDown}", "Memory"],
    ["{ArrowLeft}", "Intimacy"],
    ["{ArrowUp}", "Novelty"],
  ])("pressing %s shows %s in info panel", async (key, label) => {
    const user = userEvent.setup();
    render(<ExperienceDotsVisualization mode="personal" />);
    focusRegion();
    await user.keyboard(key);
    expect(screen.getByRole("status")).toHaveTextContent(label);
  });

  it("Enter focuses Freedom", async () => {
    const user = userEvent.setup();
    render(<ExperienceDotsVisualization mode="personal" />);
    focusRegion();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("Freedom");
  });

  it("Space focuses Freedom", async () => {
    const user = userEvent.setup();
    render(<ExperienceDotsVisualization mode="personal" />);
    focusRegion();
    await user.keyboard(" ");
    expect(screen.getByRole("status")).toHaveTextContent("Freedom");
  });

  it("Escape clears the active region and removes the info panel", async () => {
    const user = userEvent.setup();
    render(<ExperienceDotsVisualization mode="personal" />);
    focusRegion();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("status")).toHaveTextContent("Sovereignty");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("ignores unmapped keys", async () => {
    const user = userEvent.setup();
    render(<ExperienceDotsVisualization mode="personal" />);
    focusRegion();
    await user.keyboard("a");
    expect(screen.queryByRole("status")).toBeNull();
  });
});
