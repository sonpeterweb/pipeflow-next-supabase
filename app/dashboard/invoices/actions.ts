"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getInvoiceValidationMessage,
  parseInvoiceFormData,
} from "@/lib/invoices/validation";
import { createClient } from "@/lib/supabase/server";

const invoicesPath = "/dashboard/invoices";

function redirectWithMessage(type: "error" | "success", message: string): never {
  redirect(`${invoicesPath}?${type}=${encodeURIComponent(message)}`);
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

export async function createInvoice(formData: FormData) {
  const parsed = parseInvoiceFormData(formData);

  if (!parsed.success) {
    redirectWithMessage("error", getInvoiceValidationMessage(parsed.error));
  }

  const { supabase, userId } = await getAuthenticatedUserId();
  const { error } = await supabase.from("invoices").insert({
    ...parsed.data,
    user_id: userId,
  });

  if (error) {
    redirectWithMessage("error", error.message);
  }

  revalidatePath(invoicesPath);
  redirectWithMessage("success", "Invoice created.");
}

export async function updateInvoice(invoiceId: string, formData: FormData) {
  const parsed = parseInvoiceFormData(formData);

  if (!parsed.success) {
    redirectWithMessage("error", getInvoiceValidationMessage(parsed.error));
  }

  const { supabase, userId } = await getAuthenticatedUserId();
  const { error } = await supabase
    .from("invoices")
    .update(parsed.data)
    .eq("id", invoiceId)
    .eq("user_id", userId);

  if (error) {
    redirectWithMessage("error", error.message);
  }

  revalidatePath(invoicesPath);
  redirectWithMessage("success", "Invoice updated.");
}

export async function deleteInvoice(invoiceId: string) {
  const { supabase, userId } = await getAuthenticatedUserId();
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId)
    .eq("user_id", userId);

  if (error) {
    redirectWithMessage("error", error.message);
  }

  revalidatePath(invoicesPath);
  redirectWithMessage("success", "Invoice deleted.");
}
