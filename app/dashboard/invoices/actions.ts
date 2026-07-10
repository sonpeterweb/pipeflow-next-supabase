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
  getInvoiceValidationMessage,
  parseInvoiceFormData,
} from "@/lib/invoices/validation";
import {
  demoDeleteDisabledMessage,
  isDemoUser,
} from "@/lib/auth/is-demo-user";
import { createClient } from "@/lib/supabase/server";

const invoicesPath = "/dashboard/invoices";

function redirectWithMessage(type: FeedbackType, message: string): never {
  redirectWithFeedback(invoicesPath, type, message);
}

async function getAuthenticatedUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function createInvoice(formData: FormData) {
  const parsed = parseInvoiceFormData(formData);

  if (!parsed.success) {
    redirectWithMessage("error", getInvoiceValidationMessage(parsed.error));
  }

  const { supabase, user } = await getAuthenticatedUserId();
  const { error } = await supabase.from("invoices").insert({
    ...parsed.data,
    user_id: user.id,
  });

  if (error) {
    logServerActionError("createInvoice", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("create invoice"));
  }

  revalidatePath(invoicesPath);
  redirectWithMessage("success", "Invoice created successfully.");
}

export async function updateInvoice(invoiceId: string, formData: FormData) {
  const parsed = parseInvoiceFormData(formData);

  if (!parsed.success) {
    redirectWithMessage("error", getInvoiceValidationMessage(parsed.error));
  }

  const { supabase, user } = await getAuthenticatedUserId();
  const { error } = await supabase
    .from("invoices")
    .update(parsed.data)
    .eq("id", invoiceId)
    .eq("user_id", user.id);

  if (error) {
    logServerActionError("updateInvoice", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("update invoice"));
  }

  revalidatePath(invoicesPath);
  redirectWithMessage("success", "Invoice updated.");
}

export async function deleteInvoice(invoiceId: string) {
  const { supabase, user } = await getAuthenticatedUserId();

  if (isDemoUser(user)) {
    redirectWithMessage("warning", demoDeleteDisabledMessage);
  }

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId)
    .eq("user_id", user.id);

  if (error) {
    logServerActionError("deleteInvoice", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("delete invoice"));
  }

  revalidatePath(invoicesPath);
  redirectWithMessage("success", "Invoice deleted.");
}
