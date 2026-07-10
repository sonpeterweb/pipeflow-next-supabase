"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getSafeMutationErrorMessage,
  logServerActionError,
  redirectWithFeedback,
  type FeedbackType,
} from "@/lib/actions/action-result";
import {
  getQuoteValidationMessage,
  parseQuoteFormData,
} from "@/lib/quotes/validation";
import { createClient } from "@/lib/supabase/server";

const quotesPath = "/dashboard/quotes";

function redirectWithMessage(type: FeedbackType, message: string): never {
  redirectWithFeedback(quotesPath, type, message);
}

async function getAuthenticatedUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, userId: user.id };
}

export async function createQuote(formData: FormData) {
  const parsed = parseQuoteFormData(formData);

  if (!parsed.success) {
    redirectWithMessage("error", getQuoteValidationMessage(parsed.error));
  }

  const { supabase, userId } = await getAuthenticatedUserId();
  const { error } = await supabase.from("quotes").insert({
    ...parsed.data,
    user_id: userId,
  });

  if (error) {
    logServerActionError("createQuote", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("create quote"));
  }

  revalidatePath(quotesPath);
  redirectWithMessage("success", "Quote created successfully.");
}

export async function updateQuote(quoteId: string, formData: FormData) {
  const parsed = parseQuoteFormData(formData);

  if (!parsed.success) {
    redirectWithMessage("error", getQuoteValidationMessage(parsed.error));
  }

  const { supabase, userId } = await getAuthenticatedUserId();
  const { error } = await supabase
    .from("quotes")
    .update(parsed.data)
    .eq("id", quoteId)
    .eq("user_id", userId);

  if (error) {
    logServerActionError("updateQuote", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("update quote"));
  }

  revalidatePath(quotesPath);
  redirectWithMessage("success", "Quote updated.");
}

export async function deleteQuote(quoteId: string) {
  const { supabase, userId } = await getAuthenticatedUserId();
  const { error } = await supabase
    .from("quotes")
    .delete()
    .eq("id", quoteId)
    .eq("user_id", userId);

  if (error) {
    logServerActionError("deleteQuote", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("delete quote"));
  }

  revalidatePath(quotesPath);
  redirectWithMessage("success", "Quote deleted.");
}
