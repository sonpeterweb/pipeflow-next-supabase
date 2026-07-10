import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ConfirmationDialog } from "@/components/feedback/confirmation-dialog";

describe("ConfirmationDialog", () => {
  it("requires confirmation before submitting a destructive action", async () => {
    const action = vi.fn();
    render(
      <ConfirmationDialog
        action={action}
        confirmLabel="Delete customer"
        description="This action cannot be undone."
        title="Delete customer?"
        triggerLabel="Delete customer"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete customer" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();
    expect(screen.getAllByRole("button", { name: "Delete customer" })).toHaveLength(2);
  });
});
