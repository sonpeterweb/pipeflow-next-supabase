import { describe, expect, it } from "vitest";

import { parseJobFormData } from "@/lib/jobs/validation";

function formDataFrom(values: Record<string, string>) {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    formData.set(key, value);
  });

  return formData;
}

describe("parseJobFormData", () => {
  it("trims titles and normalizes empty optional fields", () => {
    const result = parseJobFormData(
      formDataFrom({
        title: "  Fix leaking kitchen pipe  ",
        customer_id: "",
        status: "lead",
        priority: "",
        estimated_amount: "",
        scheduled_date: "",
      }),
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toMatchObject({
        title: "Fix leaking kitchen pipe",
        customer_id: null,
        priority: null,
        estimated_amount: null,
        scheduled_date: null,
      });
    }
  });

  it("rejects unsupported statuses", () => {
    const result = parseJobFormData(
      formDataFrom({
        title: "Hot water cylinder inspection",
        status: "archived",
      }),
    );

    expect(result.success).toBe(false);
  });
});
