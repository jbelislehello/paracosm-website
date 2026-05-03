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

  it("mousedown on the SVG focuses the compass region", () => {
    render(<ExperienceDotsVisualization mode="personal" />);
    const region = screen.getByTestId("compass-keyboard-region");
    const svg = region.querySelector("svg")!;
    fireEvent.mouseDown(svg);
    expect(document.activeElement).toBe(region);
  });

  it("Escape clears the region and keeps focus on the compass", async () => {
    const user = userEvent.setup();
    render(<ExperienceDotsVisualization mode="personal" />);
    const region = focusRegion();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("status")).toHaveTextContent("Sovereignty");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("status")).toBeNull();
    expect(document.activeElement).toBe(region);
  });

  it("clicking outside the compass clears the active region", async () => {
    const user = userEvent.setup();
    render(<ExperienceDotsVisualization mode="personal" />);
    focusRegion();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("status")).toHaveTextContent("Sovereignty");
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("Enter on a legend button latches the region across blur", async () => {
    const user = userEvent.setup();
    render(<ExperienceDotsVisualization mode="personal" />);
    const sov = screen.getByRole("button", { name: /^sovereignty$/i });
    sov.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("Sovereignty");
    // Move focus to another legend button; latch should persist.
    const memory = screen.getByRole("button", { name: /^memory$/i });
    memory.focus();
    expect(screen.getByRole("status")).toHaveTextContent("Sovereignty");
  });

  it("Space on a latched legend button toggles the region off", async () => {
    const user = userEvent.setup();
    render(<ExperienceDotsVisualization mode="personal" />);
    const sov = screen.getByRole("button", { name: /^sovereignty$/i });
    sov.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("Sovereignty");
    await user.keyboard(" ");
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("Enter on a hotspot updates the info panel", async () => {
    const user = userEvent.setup();
    render(<ExperienceDotsVisualization mode="personal" />);
    const hotspots = screen.getAllByRole("button", { name: /^Novelty$/ });
    // The hotspot trigger is positioned absolutely; pick the one inside the compass region.
    const region = screen.getByTestId("compass-keyboard-region");
    const hotspot = hotspots.find((b) => region.contains(b))!;
    hotspot.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("Novelty");
  });

  it("Escape clears a latched region from a legend button", async () => {
    const user = userEvent.setup();
    render(<ExperienceDotsVisualization mode="personal" />);
    const sov = screen.getByRole("button", { name: /^sovereignty$/i });
    sov.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("Sovereignty");
    // Escape is wired on the compass region.
    focusRegion();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("status")).toBeNull();
  });
});
});

