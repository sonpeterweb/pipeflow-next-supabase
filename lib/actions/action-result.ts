import { redirect } from "next/navigation";
import type { z } from "zod";

export type ActionResult = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type FeedbackType = "error" | "info" | "success" | "warning";

export function getFieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[]>;
}

export function getSafeMutationErrorMessage(action = "save changes") {
  return `Unable to ${action}. Please try again.`;
}

export function logServerActionError(context: string, error: unknown) {
  console.error(`[${context}]`, error);
}

export function redirectWithFeedback(
  path: string,
  type: FeedbackType,
  message: string,
): never {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}
