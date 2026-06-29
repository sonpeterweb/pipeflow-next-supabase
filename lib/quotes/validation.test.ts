import { describe, expect, it } from "vitest";

import { parseQuoteFormData } from "@/lib/quotes/validation";

function formDataFrom(values: Record<string, string>) {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    formData.set(key, value);
  });

  return formData;
}

describe("parseQuoteFormData", () => {
  it("normalizes optional links and parses amount", () => {
    const result = parseQuoteFormData(
      formDataFrom({
        quote_number: "  Q-1001  ",
        customer_id: "",
        job_id: "",
        amount: "1250.50",
        status: "draft",
        issued_at: "",
        accepted_at: "",
      }),
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toMatchObject({
        quote_number: "Q-1001",
        customer_id: null,
        job_id: null,
        amount: 1250.5,
        issued_at: null,
        accepted_at: null,
      });
    }
  });

  it("rejects unsupported statuses", () => {
    const result = parseQuoteFormData(
      formDataFrom({
        amount: "100",
        status: "approved",
      }),
    );

    expect(result.success).toBe(false);
  });
});
