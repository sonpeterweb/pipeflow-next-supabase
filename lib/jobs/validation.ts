import { z } from "zod";

export const jobStatuses = [
  "lead",
  "quoted",
  "scheduled",
  "in_progress",
  "completed",
  "paid",
  "cancelled",
] as const;

export const jobPriorities = ["low", "medium", "high", "urgent"] as const;

function optionalText(maxLength: number) {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, z.string().max(maxLength).nullable());
}

const optionalUuid = z.preprocess((value) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}, z.uuid("Select a valid customer.").nullable());

const optionalPriority = z.preprocess((value) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}, z.enum(jobPriorities).nullable());

const optionalAmount = z.preprocess((value) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? Number(trimmed) : null;
}, z.number("Enter a valid estimated amount.").min(0).nullable());

const optionalScheduledDate = z.preprocess((value) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? trimmed : date.toISOString();
}, z.iso.datetime("Enter a valid scheduled date.").nullable());

export const jobFormSchema = z.object({
  title: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z
      .string()
      .min(1, "Job title is required.")
      .max(160, "Job title must be 160 characters or fewer."),
  ),
  customer_id: optionalUuid,
  description: optionalText(1000),
  address: optionalText(255),
  status: z.enum(jobStatuses),
  priority: optionalPriority,
  estimated_amount: optionalAmount,
  scheduled_date: optionalScheduledDate,
});

export type JobFormValues = z.infer<typeof jobFormSchema>;

export function parseJobFormData(formData: FormData) {
  return jobFormSchema.safeParse({
    title: formData.get("title"),
    customer_id: formData.get("customer_id"),
    description: formData.get("description"),
    address: formData.get("address"),
    status: formData.get("status") ?? "lead",
    priority: formData.get("priority"),
    estimated_amount: formData.get("estimated_amount"),
    scheduled_date: formData.get("scheduled_date"),
  });
}

export function getJobValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? "Check the job details and try again.";
}
