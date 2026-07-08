import { redirect } from "next/navigation";
import {
  Bell,
  Building2,
  CalendarDays,
  Globe2,
  LogOut,
  Palette,
  ShieldAlert,
  UserCircle,
} from "lucide-react";

import { logout } from "@/app/(auth)/actions";
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

type DangerActionProps = {
  actionLabel: string;
  description: string;
  risk: string;
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

function ComingSoonBadge() {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-brand-primary-light px-2.5 py-1 text-xs font-semibold text-brand-primary ring-1 ring-inset ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-900">
      Coming Soon
    </span>
  );
}

function PlaceholderSave({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "outline" | "primary";
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ComingSoonBadge />
      <Button
        disabled
        type="button"
        variant={variant === "outline" ? "outline" : "primary"}
      >
        {children}
      </Button>
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

function DangerAction({
  actionLabel,
  description,
  risk,
  title,
}: DangerActionProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-white p-4 dark:border-red-900 dark:bg-slate-950">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-red-900 dark:text-red-200">
            {title}
          </p>
          <p className="mt-1 text-sm leading-6 text-red-700 dark:text-red-300">
            {description}
          </p>
          <p className="mt-2 text-sm font-medium text-red-800 dark:text-red-200">
            {risk}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <ComingSoonBadge />
          <Button disabled type="button" variant="destructive">
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
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

  const companyName =
    typeof user.user_metadata.company_name === "string"
      ? user.user_metadata.company_name
      : "PipeFlow Demo Workspace";

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
          Configure the workspace experience for your plumbing business. These
          controls are prepared for production settings without changing current
          data or auth behavior.
        </p>
      </div>

      <SettingsSection
        description="Basic business identity shown throughout the workspace."
        icon={<Building2 aria-hidden="true" className="size-5" />}
        title="Workspace"
      >
        <SettingsGrid>
          <Field>
            <FieldLabel>Company name</FieldLabel>
            <Input defaultValue={companyName} disabled name="companyName" />
            <FieldHint>Loaded from your account metadata when available.</FieldHint>
          </Field>
          <Field>
            <FieldLabel>Business type</FieldLabel>
            <Select defaultValue="plumbing" disabled name="businessType">
              <option value="plumbing">Plumbing business</option>
              <option value="trades">Trade services</option>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Website</FieldLabel>
            <Input
              disabled
              name="website"
              placeholder="https://example.co.nz"
              type="url"
            />
          </Field>
          <Field>
            <FieldLabel>Phone number</FieldLabel>
            <Input disabled name="phone" placeholder="+64 9 123 4567" type="tel" />
          </Field>
        </SettingsGrid>
        <SettingsFooter>
          <DisabledNotice>
            Workspace profile persistence is not connected yet.
          </DisabledNotice>
          <PlaceholderSave>Save workspace</PlaceholderSave>
        </SettingsFooter>
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
            Notification preferences are UI-only until delivery settings are
            connected.
          </DisabledNotice>
          <PlaceholderSave variant="outline">Save notifications</PlaceholderSave>
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
              Password reset and account security flows are not implemented in
              this demo settings surface.
            </p>
            <Button className="mt-4" disabled type="button" variant="outline">
              Manage password
            </Button>
          </div>
          <form action={logout}>
            <Button className="gap-2" type="submit" variant="outline">
              <LogOut aria-hidden="true" className="size-4" />
              Sign out
            </Button>
          </form>
        </div>
      </SettingsSection>

      <Card className="border-red-200 bg-red-50/60 dark:border-red-900 dark:bg-red-950/30">
        <div className="grid gap-6 p-6 lg:grid-cols-[260px_1fr]">
          <CardHeader className="p-0">
            <div className="flex size-10 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
              <ShieldAlert aria-hidden="true" className="size-5" />
            </div>
            <CardTitle className="mt-4 text-base text-red-900 dark:text-red-200">
              Danger Zone
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              Destructive account and workspace actions will live here when
              backend support exists.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-0">
            <DangerAction
              actionLabel="Delete workspace"
              description="Remove workspace settings, records, and team access when a secure backend flow exists."
              risk="This action cannot be undone."
              title="Delete workspace"
            />
            <DangerAction
              actionLabel="Delete account"
              description="Close the signed-in account and revoke access to PipeFlow."
              risk="This would permanently remove account access."
              title="Delete account"
            />
          </CardContent>
        </div>
      </Card>
    </section>
  );
}
