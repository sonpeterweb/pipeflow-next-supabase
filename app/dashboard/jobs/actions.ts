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
  getJobValidationMessage,
  parseJobFormData,
} from "@/lib/jobs/validation";
import { createClient } from "@/lib/supabase/server";

const jobsPath = "/dashboard/jobs";

function redirectWithMessage(type: FeedbackType, message: string): never {
  redirectWithFeedback(jobsPath, type, message);
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

export async function createJob(formData: FormData) {
  const parsed = parseJobFormData(formData);

  if (!parsed.success) {
    redirectWithMessage("error", getJobValidationMessage(parsed.error));
  }

  const { supabase, userId } = await getAuthenticatedUserId();
  const { error } = await supabase.from("jobs").insert({
    ...parsed.data,
    user_id: userId,
  });

  if (error) {
    logServerActionError("createJob", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("create job"));
  }

  revalidatePath(jobsPath);
  redirectWithMessage("success", "Job created successfully.");
}

export async function updateJob(jobId: string, formData: FormData) {
  const parsed = parseJobFormData(formData);

  if (!parsed.success) {
    redirectWithMessage("error", getJobValidationMessage(parsed.error));
  }

  const { supabase, userId } = await getAuthenticatedUserId();
  const { error } = await supabase
    .from("jobs")
    .update(parsed.data)
    .eq("id", jobId)
    .eq("user_id", userId);

  if (error) {
    logServerActionError("updateJob", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("update job"));
  }

  revalidatePath(jobsPath);
  redirectWithMessage("success", "Job updated.");
}

export async function deleteJob(jobId: string) {
  const { supabase, userId } = await getAuthenticatedUserId();
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId)
    .eq("user_id", userId);

  if (error) {
    logServerActionError("deleteJob", error);
    redirectWithMessage("error", getSafeMutationErrorMessage("delete job"));
  }

  revalidatePath(jobsPath);
  redirectWithMessage("success", "Job deleted.");
}
