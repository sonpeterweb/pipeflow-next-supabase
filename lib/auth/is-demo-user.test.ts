import { describe, expect, it } from "vitest";

import {
  demoDeleteDisabledMessage,
  getConfiguredDemoEmail,
  isDemoUser,
  isDemoUserEmail,
} from "@/lib/auth/is-demo-user";

describe("demo user helpers", () => {
  it("normalizes configured demo email", () => {
    expect(getConfiguredDemoEmail({ DEMO_USER_EMAIL: " Demo@PipeFlow.Local " })).toBe(
      "demo@pipeflow.local",
    );
  });

  it("identifies the configured demo user by email", () => {
    expect(
      isDemoUserEmail("DEMO@pipeflow.local", {
        DEMO_USER_EMAIL: "demo@pipeflow.local",
      }),
    ).toBe(true);
  });

  it("fails safely when demo email is not configured", () => {
    expect(isDemoUserEmail("demo@pipeflow.local", {})).toBe(false);
  });

  it("does not restrict normal users", () => {
    expect(
      isDemoUser({ email: "owner@example.co.nz" }, { DEMO_USER_EMAIL: "demo@pipeflow.local" }),
    ).toBe(false);
  });

  it("exposes a clear destructive-action restriction message", () => {
    expect(demoDeleteDisabledMessage).toBe(
      "Deleting records is disabled in the public demo.",
    );
  });
});
