"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  getSafeMutationErrorMessage,
  logServerActionError,
  redirectWithFeedback,
  type FeedbackType,
} from "@/lib/actions/action-result";
import { createClient } from "@/lib/supabase/server";

const settingsPath = "/dashboard/settings";

const workspaceProfileSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters.")
    .max(120, "Company name must be 120 characters or fewer."),
  full_name: z
    .string()
    .trim()
    .max(120, "Owner name must be 120 characters or fewer.")
    .optional()
    .transform((value) => value || null),
});

function redirectWithMessage(type: FeedbackType, message: string): never {
  redirectWithFeedback(settingsPath, type, message);
}

export async function updateWorkspaceProfile(formData: FormData) {
  const parsed = workspaceProfileSchema.safeParse({
    company_name: formData.get("company_name"),
    full_name: formData.get("full_name"),
  });

  if (!parsed.success) {
    redirectWithMessage("error", parsed.error.issues[0]?.message ?? "Invalid settings.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    ...parsed.data,
  });

  if (profileError) {
    logServerActionError("updateWorkspaceProfile.profile", profileError);
    redirectWithMessage("error", getSafeMutationErrorMessage("save settings"));
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: {
      company_name: parsed.data.company_name,
      full_name: parsed.data.full_name,
    },
  });

  if (authError) {
    logServerActionError("updateWorkspaceProfile.auth", authError);
    redirectWithMessage("error", getSafeMutationErrorMessage("save settings"));
  }

  revalidatePath(settingsPath);
  redirectWithMessage("success", "Settings saved.");
}
