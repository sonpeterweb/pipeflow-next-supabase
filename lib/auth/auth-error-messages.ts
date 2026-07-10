export function getAuthErrorMessage(message?: string) {
  const normalized = (message ?? "").toLowerCase();

  if (
    normalized.includes("invalid login") ||
    normalized.includes("invalid credentials") ||
    normalized.includes("email not confirmed") ||
    normalized.includes("invalid email or password")
  ) {
    return normalized.includes("confirm")
      ? "Please confirm your email before signing in."
      : "The email or password is incorrect.";
  }

  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "An account already exists for this email.";
  }

  if (normalized.includes("password")) {
    return "Use a stronger password and try again.";
  }

  if (normalized.includes("network") || normalized.includes("fetch")) {
    return "We could not connect to PipeFlow. Please try again.";
  }

  return "Something went wrong. Please try again.";
}

export function getDemoLoginErrorMessage(message?: string) {
  const normalized = (message ?? "").toLowerCase();

  if (normalized.includes("missing") || normalized.includes("not configured")) {
    return "The demo workspace is temporarily unavailable.";
  }

  return "We could not open the demo workspace. Please try again.";
}
