import { createServerFn } from "@tanstack/react-start";

const DEMO_EMAIL = "bhuvansayna.demo@ecobot.app";
const DEMO_PASSWORD = "BhuvanDemo!2026#ReadOnly";
const DEMO_DISPLAY_NAME = "Bhuvan Sayna";

export const getDemoSession = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // Ensure demo user exists (idempotent)
  const { data: signIn, error: signInErr } = await supabaseAdmin.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  if (signIn?.session) {
    return {
      access_token: signIn.session.access_token,
      refresh_token: signIn.session.refresh_token,
    };
  }

  // Create user if not found
  if (signInErr) {
    const { error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: DEMO_DISPLAY_NAME, name: DEMO_DISPLAY_NAME },
    });
    if (createErr && !createErr.message.toLowerCase().includes("already")) {
      throw createErr;
    }
  }

  const { data: retry, error: retryErr } = await supabaseAdmin.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });
  if (retryErr || !retry.session) {
    throw retryErr ?? new Error("Failed to start demo session");
  }
  return {
    access_token: retry.session.access_token,
    refresh_token: retry.session.refresh_token,
  };
});
