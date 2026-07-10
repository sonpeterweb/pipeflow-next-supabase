import { describe, expect, it } from "vitest";

import {
  getAuthErrorMessage,
  getDemoLoginErrorMessage,
} from "@/lib/auth/auth-error-messages";

describe("auth error messages", () => {
  it("maps invalid credential errors to a safe message", () => {
    expect(getAuthErrorMessage("Invalid login credentials")).toBe(
      "The email or password is incorrect.",
    );
  });

  it("maps email confirmation errors to a safe message", () => {
    expect(getAuthErrorMessage("Email not confirmed")).toBe(
      "Please confirm your email before signing in.",
    );
  });

  it("does not expose unknown provider errors", () => {
    expect(getAuthErrorMessage("PostgREST request failed: private detail")).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("maps missing demo credentials to an availability message", () => {
    expect(getDemoLoginErrorMessage("missing demo credentials")).toBe(
      "The demo workspace is temporarily unavailable.",
    );
  });
});
