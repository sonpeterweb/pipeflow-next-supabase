import { z } from "zod";

export const quoteStatuses = [
  "draft",
  "sent",
  "accepted",
  "declined",
  "expired",
] as const;

function optionalText(maxLength: number) {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, z.string().max(maxLength).nullable());
}

function optionalUuid(message: string) {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, z.uuid(message).nullable());
}

function optionalDateTime(message: string) {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const date = new Date(trimmed);
    return Number.isNaN(date.getTime()) ? trimmed : date.toISOString();
  }, z.iso.datetime(message).nullable());
}

const amount = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? Number(trimmed) : undefined;
}, z.number("Quote amount is required.").min(0, "Quote amount cannot be negative."));

export const quoteFormSchema = z.object({
  quote_number: optionalText(80),
  customer_id: optionalUuid("Select a valid customer."),
  job_id: optionalUuid("Select a valid job."),
  amount,
  status: z.enum(quoteStatuses),
  issued_at: optionalDateTime("Enter a valid issued date."),
  accepted_at: optionalDateTime("Enter a valid accepted date."),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export function parseQuoteFormData(formData: FormData) {
  return quoteFormSchema.safeParse({
    quote_number: formData.get("quote_number"),
    customer_id: formData.get("customer_id"),
    job_id: formData.get("job_id"),
    amount: formData.get("amount"),
    status: formData.get("status") ?? "draft",
    issued_at: formData.get("issued_at"),
    accepted_at: formData.get("accepted_at"),
  });
}

export function getQuoteValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Check the quote details and try again.";
}
