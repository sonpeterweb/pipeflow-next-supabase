"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  getCustomerValidationMessage,
  parseCustomerFormData,
} from "@/lib/customers/validation";
import { createClient } from "@/lib/supabase/server";

const customersPath = "/dashboard/customers";

function redirectWithMessage(type: "error" | "success", message: string): never {
  redirect(`${customersPath}?${type}=${encodeURIComponent(message)}`);
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

export async function createCustomer(formData: FormData) {
  const parsed = parseCustomerFormData(formData);

  if (!parsed.success) {
    redirectWithMessage("error", getCustomerValidationMessage(parsed.error));
  }

  const { supabase, userId } = await getAuthenticatedUserId();
  const { error } = await supabase.from("customers").insert({
    ...parsed.data,
    user_id: userId,
  });

  if (error) {
    redirectWithMessage("error", error.message);
  }

  revalidatePath(customersPath);
  redirectWithMessage("success", "Customer created.");
}

export async function updateCustomer(customerId: string, formData: FormData) {
  const parsed = parseCustomerFormData(formData);

  if (!parsed.success) {
    redirectWithMessage("error", getCustomerValidationMessage(parsed.error));
  }

  const { supabase, userId } = await getAuthenticatedUserId();
  const { error } = await supabase
    .from("customers")
    .update(parsed.data)
    .eq("id", customerId)
    .eq("user_id", userId);

  if (error) {
    redirectWithMessage("error", error.message);
  }

  revalidatePath(customersPath);
  redirectWithMessage("success", "Customer updated.");
}

export async function deleteCustomer(customerId: string) {
  const { supabase, userId } = await getAuthenticatedUserId();
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId)
    .eq("user_id", userId);

  if (error) {
    redirectWithMessage("error", error.message);
  }

  revalidatePath(customersPath);
  redirectWithMessage("success", "Customer deleted.");
}
