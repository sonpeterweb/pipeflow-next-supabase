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
  getCustomerValidationMessage,
  parseCustomerFormData,
} from "@/lib/customers/validation";
import { createClient } from "@/lib/supabase/server";

const customersPath = "/dashboard/customers";

function redirectWithMessage(type: FeedbackType, message: string): never {
  redirectWithFeedback(customersPath, type, message);
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
    logServerActionError("createCustomer", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("create customer"));
  }

  revalidatePath(customersPath);
  redirectWithMessage("success", "Customer created successfully.");
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
    logServerActionError("updateCustomer", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("update customer"));
  }

  revalidatePath(customersPath);
  redirectWithMessage("success", "Customer details updated.");
}

export async function deleteCustomer(customerId: string) {
  const { supabase, userId } = await getAuthenticatedUserId();
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId)
    .eq("user_id", userId);

  if (error) {
    logServerActionError("deleteCustomer", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("delete customer"));
  }

  revalidatePath(customersPath);
  redirectWithMessage("success", "Customer deleted.");
}
