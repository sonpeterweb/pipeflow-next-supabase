import { z } from "zod";

function optionalText(maxLength: number) {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, z.string().max(maxLength).nullable());
}

const optionalEmail = z.preprocess((value) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}, z.email("Enter a valid email address.").max(255).nullable());

export const customerFormSchema = z.object({
  name: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z
      .string()
      .min(1, "Customer name is required.")
      .max(120, "Customer name must be 120 characters or fewer."),
  ),
  company_name: optionalText(120),
  email: optionalEmail,
  phone: optionalText(40),
  address: optionalText(255),
  notes: optionalText(1000),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export function parseCustomerFormData(formData: FormData) {
  return customerFormSchema.safeParse({
    name: formData.get("name"),
    company_name: formData.get("company_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    notes: formData.get("notes"),
  });
}

export function getCustomerValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Check the customer details and try again.";
}
