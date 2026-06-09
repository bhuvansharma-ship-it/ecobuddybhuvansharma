import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function DemoAutoLogin() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) return;
        const res = await fetch("/api/public/demo-session", { method: "POST" });
        if (!res.ok) return;
        const tokens = (await res.json()) as { access_token: string; refresh_token: string };
        if (cancelled) return;
        await supabase.auth.setSession({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        });
      } catch (err) {
        console.error("Demo auto-login failed", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
