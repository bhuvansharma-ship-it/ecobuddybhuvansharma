import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/demo-session")({
  server: {
    handlers: {
      POST: async () => {
        const DEMO_EMAIL = process.env.DEMO_EMAIL;
        const DEMO_PASSWORD = process.env.DEMO_PASSWORD;
        const DEMO_DISPLAY_NAME = process.env.DEMO_DISPLAY_NAME ?? "Bhuvan";

        if (!DEMO_EMAIL || !DEMO_PASSWORD) {
          return new Response("Demo session not configured", { status: 503 });
        }

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
