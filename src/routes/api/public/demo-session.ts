import { createFileRoute } from "@tanstack/react-router";

const DEMO_EMAIL = "bhuvansayna.demo@ecobot.app";
const DEMO_PASSWORD = "BhuvanDemo!2026#ReadOnly";
const DEMO_DISPLAY_NAME = "Bhuvan Sayna";

export const Route = createFileRoute("/api/public/demo-session")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          let { data: signIn } = await supabaseAdmin.auth.signInWithPassword({
            email: DEMO_EMAIL,
            password: DEMO_PASSWORD,
          });

          if (!signIn?.session) {
            await supabaseAdmin.auth.admin.createUser({
              email: DEMO_EMAIL,
              password: DEMO_PASSWORD,
              email_confirm: true,
              user_metadata: { display_name: DEMO_DISPLAY_NAME, name: DEMO_DISPLAY_NAME },
            });
            const retry = await supabaseAdmin.auth.signInWithPassword({
              email: DEMO_EMAIL,
              password: DEMO_PASSWORD,
            });
            signIn = retry.data;
          }

          if (!signIn?.session) {
            return new Response("Failed to start demo session", { status: 500 });
          }

          return Response.json({
            access_token: signIn.session.access_token,
            refresh_token: signIn.session.refresh_token,
          });
        } catch (err) {
          console.error("demo-session error", err);
          return new Response("error", { status: 500 });
        }
      },
    },
  },
});
