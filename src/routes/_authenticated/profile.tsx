import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (error) toast.error(error.message);
      setDisplayName(data?.display_name ?? "");
      setAvatarUrl(data?.avatar_url ?? "");
      setLoading(false);
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: displayName || null,
      avatar_url: avatarUrl || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  const initial = (displayName || user?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-emerald-50 to-white px-5 pt-14 pb-10">
      <button
        onClick={() => router.history.back()}
        className="mb-4 inline-flex items-center gap-1 text-sm text-emerald-800 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-emerald-950">Your profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>

      <div className="mt-6 flex items-center gap-4">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-20 w-20 rounded-full object-cover ring-2 ring-emerald-200"
            onError={() => setAvatarUrl("")}
          />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-700 text-2xl font-semibold text-white ring-2 ring-emerald-200">
            {initial}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="name">Display name</Label>
          <Input
            id="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="How should we call you?"
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="avatar">Avatar URL</Label>
          <Input
            id="avatar"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://…"
            disabled={loading}
          />
        </div>

        <Button onClick={save} disabled={saving || loading} className="w-full bg-emerald-700 hover:bg-emerald-800">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save changes
        </Button>

        <Button asChild variant="ghost" className="w-full">
          <Link to="/">Done</Link>
        </Button>
      </div>
    </div>
  );
}
