import { describe, expect, it } from "vitest";

import { parseCustomerFormData } from "@/lib/customers/validation";

function formDataFrom(values: Record<string, string>) {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    formData.set(key, value);
  });

  return formData;
}

describe("parseCustomerFormData", () => {
  it("trims customer names and normalizes empty optional fields", () => {
    const result = parseCustomerFormData(
      formDataFrom({
        name: "  Auckland Property Care  ",
        email: "",
        phone: "",
      }),
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toMatchObject({
        name: "Auckland Property Care",
        email: null,
        phone: null,
      });
    }
  });

  it("rejects invalid email addresses", () => {
    const result = parseCustomerFormData(
      formDataFrom({
        name: "North Shore Villas",
        email: "not-an-email",
      }),
    );

    expect(result.success).toBe(false);
  });
});
