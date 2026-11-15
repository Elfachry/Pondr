
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  // Check if Supabase returned an authentication error
  const authError =
    url.searchParams.get("error_description") ??
    url.searchParams.get("error");

  if (authError) {
    console.error("Supabase Auth Error:", authError);
    return NextResponse.redirect(
      new URL("/login?error=auth", url.origin)
    );
  }

  if (!code) {
    console.error("Auth callback: Authorization code is missing");
    return NextResponse.redirect(
      new URL("/login?error=auth", url.origin)
    );
  }

  // Use server client so the session can be stored in cookies
  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback exchange error:", error.message);

    return NextResponse.redirect(
      new URL("/login?error=auth", url.origin)
    );
  }

  return NextResponse.redirect(new URL("/", url.origin));
}
