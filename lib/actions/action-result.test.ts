import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import {
  getFieldErrors,
  getSafeMutationErrorMessage,
  logServerActionError,
} from "@/lib/actions/action-result";

describe("action result helpers", () => {
  it("flattens zod field errors", () => {
    const result = z.object({ name: z.string().min(1, "Name is required.") }).safeParse({
      name: "",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(getFieldErrors(result.error)).toEqual({
        name: ["Name is required."],
      });
    }
  });

  it("creates safe mutation messages", () => {
    expect(getSafeMutationErrorMessage("save changes")).toBe(
      "Unable to save changes. Please try again.",
    );
  });

  it("logs server action errors with context", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("database detail");

    logServerActionError("createCustomer", error);

    expect(spy).toHaveBeenCalledWith("[createCustomer]", error);
    spy.mockRestore();
  });
});
