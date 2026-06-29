"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getQuoteValidationMessage,
  parseQuoteFormData,
} from "@/lib/quotes/validation";
import { createClient } from "@/lib/supabase/server";

const quotesPath = "/dashboard/quotes";

function redirectWithMessage(type: "error" | "success", message: string): never {
  redirect(`${quotesPath}?${type}=${encodeURIComponent(message)}`);
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
    redirectWithMessage("error", error.message);
  }

  revalidatePath(quotesPath);
  redirectWithMessage("success", "Quote created.");
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
    redirectWithMessage("error", error.message);
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
    redirectWithMessage("error", error.message);
  }

  revalidatePath(quotesPath);
  redirectWithMessage("success", "Quote deleted.");
}
