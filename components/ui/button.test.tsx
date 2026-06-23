import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders a button with the provided label", () => {
    render(<Button>Save job</Button>);

    expect(screen.getByRole("button", { name: "Save job" })).toBeInTheDocument();
  });

  it("uses button type by default", () => {
    render(<Button>Open</Button>);

    expect(screen.getByRole("button", { name: "Open" })).toHaveAttribute(
      "type",
      "button",
    );
  });
});
