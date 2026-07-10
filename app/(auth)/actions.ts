"use server";

import { redirect } from "next/navigation";

import type { ActionResult } from "@/lib/actions/action-result";
import {
  getAuthErrorMessage,
} from "@/lib/auth/auth-error-messages";
import { openDemoWorkspace } from "@/lib/auth/open-demo-workspace";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = Partial<ActionResult>;

const initialErrorState = {
  success: false,
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function login(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!email || !password) {
    return {
      ...initialErrorState,
      message: "Enter your email and password.",
      fieldErrors: {
        ...(!email ? { email: ["Email is required."] } : {}),
        ...(!password ? { password: ["Password is required."] } : {}),
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[login]", error);
    return { ...initialErrorState, message: getAuthErrorMessage(error.message) };
  }

  redirect("/dashboard");
}

export async function signup(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const companyName = getString(formData, "companyName");
  const email = getString(formData, "email");
  const password = getString(formData, "password");

  if (!companyName || !email || !password) {
    return {
      ...initialErrorState,
      message: "Enter your business name, email, and password.",
      fieldErrors: {
        ...(!companyName ? { companyName: ["Business name is required."] } : {}),
        ...(!email ? { email: ["Email is required."] } : {}),
        ...(!password ? { password: ["Password is required."] } : {}),
      },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        company_name: companyName,
      },
    },
  });

  if (error) {
    console.error("[signup]", error);
    return { ...initialErrorState, message: getAuthErrorMessage(error.message) };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[logout]", error);
    redirect(`/dashboard/settings?error=${encodeURIComponent("We could not sign you out. Please try again.")}`);
  }

  redirect("/login");
}

export async function loginDemo(
  state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  void state;
  void formData;

  const result = await openDemoWorkspace();

  if (!result.ok) {
    return { ...initialErrorState, message: result.message };
  }

  redirect("/dashboard");
}
