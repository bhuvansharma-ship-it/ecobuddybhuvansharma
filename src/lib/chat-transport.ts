import { DefaultChatTransport } from "ai";
import { supabase } from "@/integrations/supabase/client";

export function createAuthedChatTransport(api: string) {
  return new DefaultChatTransport({
    api,
    headers: async (): Promise<Record<string, string>> => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
  });
}
