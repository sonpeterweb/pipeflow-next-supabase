"use server";

import { redirect } from "next/navigation";

import type { ActionResult } from "@/lib/actions/action-result";
import {
  getAuthErrorMessage,
  getDemoLoginErrorMessage,
} from "@/lib/auth/auth-error-messages";
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

function getDemoCredentials() {
  const email = process.env.DEMO_USER_EMAIL?.trim().toLowerCase() ?? "";
  const password = process.env.DEMO_USER_PASSWORD?.trim() ?? "";

  return { email, password };
}

export async function loginDemo(
  state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  void state;
  void formData;

  const { email, password } = getDemoCredentials();

  if (!email || !password) {
    return {
      ...initialErrorState,
      message: getDemoLoginErrorMessage("missing demo credentials"),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("[loginDemo]", error);
    return { ...initialErrorState, message: getDemoLoginErrorMessage(error.message) };
  }

  const { count, error: dataError } = await supabase
    .from("customers")
    .select("id", { count: "exact", head: true });

  if (dataError || !count) {
    console.error("[loginDemo.verifyData]", dataError ?? "No demo customer records found.");
    await supabase.auth.signOut();
    return {
      ...initialErrorState,
      message: "The demo workspace is temporarily unavailable.",
    };
  }

  redirect("/dashboard");
}
