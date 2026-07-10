export const demoDeleteDisabledMessage =
  "Deleting records is disabled in the public demo.";

type DemoEnvironment = {
  DEMO_USER_EMAIL?: string;
};

function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() || null;
}

function getDefaultDemoEnvironment(): DemoEnvironment {
  return { DEMO_USER_EMAIL: process.env.DEMO_USER_EMAIL };
}

export function getConfiguredDemoEmail(env: DemoEnvironment = getDefaultDemoEnvironment()) {
  return normalizeEmail(env.DEMO_USER_EMAIL);
}

export function isDemoUserEmail(
  email: string | null | undefined,
  env: DemoEnvironment = getDefaultDemoEnvironment(),
) {
  const configuredEmail = getConfiguredDemoEmail(env);
  const userEmail = normalizeEmail(email);

  return Boolean(configuredEmail && userEmail && configuredEmail === userEmail);
}

export function isDemoUser(
  user: { email?: string | null } | null | undefined,
  env: DemoEnvironment = getDefaultDemoEnvironment(),
) {
  return isDemoUserEmail(user?.email, env);
}
