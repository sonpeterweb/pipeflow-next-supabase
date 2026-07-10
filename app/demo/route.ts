import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { openDemoWorkspace } from "@/lib/auth/open-demo-workspace";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

export async function GET(request: NextRequest) {
  const cookiesToApply: CookieToSet[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookiesToApply.push({ name, value, options });
          });
        },
      },
    },
  );

  const result = await openDemoWorkspace(supabase);
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.search = "";

  if (!result.ok) {
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("error", result.message);
  } else {
    redirectUrl.pathname = "/dashboard";
  }

  const response = NextResponse.redirect(redirectUrl);

  cookiesToApply.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}
