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
import {
  demoDeleteDisabledMessage,
  isDemoUser,
} from "@/lib/auth/is-demo-user";
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

  return { supabase, user };
}

export async function createCustomer(formData: FormData) {
  const parsed = parseCustomerFormData(formData);

  if (!parsed.success) {
    redirectWithMessage("error", getCustomerValidationMessage(parsed.error));
  }

  const { supabase, user } = await getAuthenticatedUserId();
  const { error } = await supabase.from("customers").insert({
    ...parsed.data,
    user_id: user.id,
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

  const { supabase, user } = await getAuthenticatedUserId();
  const { error } = await supabase
    .from("customers")
    .update(parsed.data)
    .eq("id", customerId)
    .eq("user_id", user.id);

  if (error) {
    logServerActionError("updateCustomer", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("update customer"));
  }

  revalidatePath(customersPath);
  redirectWithMessage("success", "Customer details updated.");
}

export async function deleteCustomer(customerId: string) {
  const { supabase, user } = await getAuthenticatedUserId();

  if (isDemoUser(user)) {
    redirectWithMessage("warning", demoDeleteDisabledMessage);
  }

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId)
    .eq("user_id", user.id);

  if (error) {
    logServerActionError("deleteCustomer", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("delete customer"));
  }

  revalidatePath(customersPath);
  redirectWithMessage("success", "Customer deleted.");
}
