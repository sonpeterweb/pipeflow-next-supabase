import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names and skips empty values", () => {
    expect(cn("base", false, null, undefined, "active")).toBe("base active");
  });
});
