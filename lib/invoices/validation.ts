import { z } from "zod";

export const invoiceStatuses = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
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
}, z.number("Invoice amount is required.").min(0, "Invoice amount cannot be negative."));

export const invoiceFormSchema = z.object({
  invoice_number: optionalText(80),
  customer_id: optionalUuid("Select a valid customer."),
  job_id: optionalUuid("Select a valid job."),
  amount,
  status: z.enum(invoiceStatuses),
  issued_at: optionalDateTime("Enter a valid issued date."),
  due_at: optionalDateTime("Enter a valid due date."),
  paid_at: optionalDateTime("Enter a valid paid date."),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export function parseInvoiceFormData(formData: FormData) {
  return invoiceFormSchema.safeParse({
    invoice_number: formData.get("invoice_number"),
    customer_id: formData.get("customer_id"),
    job_id: formData.get("job_id"),
    amount: formData.get("amount"),
    status: formData.get("status") ?? "draft",
    issued_at: formData.get("issued_at"),
    due_at: formData.get("due_at"),
    paid_at: formData.get("paid_at"),
  });
}

export function getInvoiceValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Check the invoice details and try again.";
}
