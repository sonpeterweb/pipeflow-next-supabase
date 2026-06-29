import { describe, expect, it } from "vitest";

import { parseInvoiceFormData } from "@/lib/invoices/validation";

function formDataFrom(values: Record<string, string>) {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    formData.set(key, value);
  });

  return formData;
}

describe("parseInvoiceFormData", () => {
  it("normalizes optional links and parses amount", () => {
    const result = parseInvoiceFormData(
      formDataFrom({
        invoice_number: "  INV-1001  ",
        customer_id: "",
        job_id: "",
        amount: "450.75",
        status: "draft",
        issued_at: "",
        due_at: "",
        paid_at: "",
      }),
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toMatchObject({
        invoice_number: "INV-1001",
        customer_id: null,
        job_id: null,
        amount: 450.75,
        issued_at: null,
        due_at: null,
        paid_at: null,
      });
    }
  });

  it("rejects unsupported statuses", () => {
    const result = parseInvoiceFormData(
      formDataFrom({
        amount: "100",
        status: "refunded",
      }),
    );

    expect(result.success).toBe(false);
  });
});
