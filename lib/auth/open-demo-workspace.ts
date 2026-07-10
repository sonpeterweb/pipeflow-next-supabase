import type { SupabaseClient } from "@supabase/supabase-js";

import { getDemoLoginErrorMessage } from "@/lib/auth/auth-error-messages";
import { createClient } from "@/lib/supabase/server";

export type OpenDemoWorkspaceResult =
  | { ok: true }
  | { ok: false; message: string };

function getDemoCredentials() {
  const email = process.env.DEMO_USER_EMAIL?.trim().toLowerCase() ?? "";
  const password = process.env.DEMO_USER_PASSWORD?.trim() ?? "";

  return { email, password };
}

export async function openDemoWorkspace(
  supabaseClient?: SupabaseClient,
): Promise<OpenDemoWorkspaceResult> {
  const { email, password } = getDemoCredentials();

  if (!email || !password) {
    return {
      ok: false,
      message: getDemoLoginErrorMessage("missing demo credentials"),
    };
  }

  const supabase = supabaseClient ?? (await createClient());
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[openDemoWorkspace]", error);
    return {
      ok: false,
      message: getDemoLoginErrorMessage(error.message),
    };
  }

  const { count, error: dataError } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true });

  if (dataError || !count) {
    console.error(
      "[openDemoWorkspace.verifyData]",
      dataError ?? "No demo customer records found.",
    );
    await supabase.auth.signOut();
    return {
      ok: false,
      message: "The demo workspace is temporarily unavailable.",
    };
  }

  return { ok: true };
}
