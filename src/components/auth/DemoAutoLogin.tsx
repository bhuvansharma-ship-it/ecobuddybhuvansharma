import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getDemoSession } from "@/lib/demo-auth.functions";

export function DemoAutoLogin() {
  const fetchDemoSession = useServerFn(getDemoSession);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) return;
        const tokens = await fetchDemoSession({});
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
  }, [fetchDemoSession]);

  return null;
}
