import { redirect } from "next/navigation";
import {
  Bell,
  Building2,
  CalendarDays,
  Globe2,
  LogOut,
  Palette,
  UserCircle,
} from "lucide-react";

import { logout } from "@/app/(auth)/actions";
import { updateWorkspaceProfile } from "@/app/dashboard/settings/actions";
import { SubmitButton } from "@/components/feedback/submit-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldHint,
  FieldLabel,
  Input,
  Select,
} from "@/components/ui/form-controls";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type SettingsSectionProps = {
  children: React.ReactNode;
  description: string;
  icon: React.ReactNode;
  title: string;
};

type ToggleRowProps = {
  checked?: boolean;
  control?: React.ReactNode;
  description: string;
  disabled?: boolean;
  title: string;
};

function SettingsSection({
  children,
  description,
  icon,
  title,
}: SettingsSectionProps) {
  return (
    <Card>
      <div className="grid gap-6 p-6 lg:grid-cols-[260px_1fr]">
        <CardHeader className="p-0">
          <div className="flex size-10 items-center justify-center rounded-lg bg-brand-primary-light text-brand-primary dark:bg-blue-950 dark:text-blue-300">
            {icon}
          </div>
          <CardTitle className="mt-4 text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">{children}</CardContent>
      </div>
    </Card>
  );
}

function SettingsGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function SettingsFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  );
}

function NotificationSetting({
  checked = false,
  control,
  description,
  disabled = true,
  title,
}: ToggleRowProps) {
  return (
    <label
      className={cn(
        "flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950",
        disabled && "cursor-not-allowed opacity-75",
      )}
    >
      <span>
        <span className="block text-sm font-semibold text-slate-950 dark:text-slate-100">
          {title}
        </span>
        <span className="mt-1 block text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </span>
      </span>
      {control ?? (
        <input
          checked={checked}
          className="mt-1 size-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900"
          disabled={disabled}
          readOnly
          type="checkbox"
        />
      )}
    </label>
  );
}

function DisabledNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
      {children}
    </p>
  );
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_name,full_name")
    .eq("id", user.id)
    .maybeSingle();
  const companyName =
    profile?.company_name ??
    (typeof user.user_metadata.company_name === "string"
      ? user.user_metadata.company_name
      : "PipeFlow Demo Workspace");
  const fullName =
    profile?.full_name ??
    (typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : "");

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary dark:text-blue-300">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-4xl">
          Workspace settings
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
          Configure the workspace identity, regional defaults, appearance, and
          account access for your plumbing business.
        </p>
      </div>

      <SettingsSection
        description="Basic business identity shown throughout the workspace."
        icon={<Building2 aria-hidden="true" className="size-5" />}
        title="Workspace"
      >
        <form action={updateWorkspaceProfile}>
          <SettingsGrid>
            <Field>
              <FieldLabel>Company name</FieldLabel>
              <Input defaultValue={companyName} name="company_name" required />
              <FieldHint>Used as the primary workspace name.</FieldHint>
            </Field>
            <Field>
              <FieldLabel>Owner name</FieldLabel>
              <Input defaultValue={fullName} name="full_name" />
              <FieldHint>Shown in account metadata and profile records.</FieldHint>
            </Field>
            <Field>
              <FieldLabel>Business type</FieldLabel>
              <Select defaultValue="plumbing" disabled name="business_type">
                <option value="plumbing">Plumbing business</option>
                <option value="trades">Trade services</option>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Region</FieldLabel>
              <Input defaultValue="New Zealand" disabled name="region" />
            </Field>
          </SettingsGrid>
          <SettingsFooter>
            <DisabledNotice>
              Profile changes are saved to Supabase and reflected across the
              workspace.
            </DisabledNotice>
            <SubmitButton pendingLabel="Saving...">Save workspace</SubmitButton>
          </SettingsFooter>
        </form>
      </SettingsSection>

      <SettingsSection
        description="Defaults for dates, money, and local scheduling."
        icon={<Globe2 aria-hidden="true" className="size-5" />}
        title="Regional preferences"
      >
        <SettingsGrid>
          <Field>
            <FieldLabel>Time zone</FieldLabel>
            <Select defaultValue="Pacific/Auckland" disabled name="timeZone">
              <option value="Pacific/Auckland">Pacific/Auckland</option>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Currency</FieldLabel>
            <Select defaultValue="NZD" disabled name="currency">
              <option value="NZD">NZD - New Zealand Dollar</option>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Date format</FieldLabel>
            <Select defaultValue="DD/MM/YYYY" disabled name="dateFormat">
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </Select>
          </Field>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-slate-100">
              <CalendarDays aria-hidden="true" className="size-4 text-brand-primary" />
              New Zealand defaults
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              PipeFlow currently formats dashboard values for New Zealand trade
              workflows.
            </p>
          </div>
        </SettingsGrid>
      </SettingsSection>

      <SettingsSection
        description="Personal display preferences for the dashboard."
        icon={<Palette aria-hidden="true" className="size-5" />}
        title="Appearance"
      >
        <div className="space-y-5">
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">
                Theme preference
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Choose light, dark, or system. This preference is saved locally.
              </p>
            </div>
            <ThemeToggle />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">
              Accent color
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span
                aria-label="PipeFlow blue"
                className="size-8 rounded-full bg-brand-primary shadow-sm"
                role="img"
              />
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  PipeFlow Blue
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Additional accent colors can be added when workspace theming is
                  backed by persistence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        description="Notification preferences prepared for future delivery settings."
        icon={<Bell aria-hidden="true" className="size-5" />}
        title="Notifications"
      >
        <div className="grid gap-3">
          <NotificationSetting
            checked
            description="Receive important account and workspace messages."
            title="Email notifications"
          />
          <NotificationSetting
            checked
            description="Get notified when jobs move between operational states."
            title="Job updates"
          />
          <NotificationSetting
            checked
            description="Receive reminders for sent quotes and outstanding invoices."
            title="Quote and invoice reminders"
          />
          <NotificationSetting
            description="Summarize jobs, invoices, and revenue once per week."
            title="Weekly summary"
          />
        </div>
        <SettingsFooter>
          <DisabledNotice>
            These defaults describe the notification model this MVP is designed
            around.
          </DisabledNotice>
        </SettingsFooter>
      </SettingsSection>

      <SettingsSection
        description="Current signed-in user and account-level actions."
        icon={<UserCircle aria-hidden="true" className="size-5" />}
        title="Account"
      >
        <div className="space-y-4">
          <Field>
            <FieldLabel>Email address</FieldLabel>
            <Input defaultValue={user.email ?? ""} disabled name="email" type="email" />
          </Field>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-950 dark:text-slate-100">
              Password management
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Account access is handled through Supabase Auth. Use sign out
              when you are finished reviewing the workspace.
            </p>
          </div>
          <form action={logout}>
            <Button className="gap-2" type="submit" variant="outline">
              <LogOut aria-hidden="true" className="size-4" />
              Sign out
            </Button>
          </form>
        </div>
      </SettingsSection>
    </section>
  );
}
