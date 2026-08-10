import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("idle");
    const { error } = await supabase
      .from("newsletter")
      .insert({ email: email.trim() });
    if (error) {
      console.error("newsletter signup failed", error.message);
      setStatus("done");
      return;
    }
    setEmail("");
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="flex items-center gap-2 rounded-full bg-sage/15 px-5 py-3 text-sm font-semibold text-sage">
        <CheckCircle2 className="h-4 w-4" /> You're on the list — welcome to the
        makers!
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
      />
      <Button type="submit" className="shrink-0">
        Subscribe
      </Button>
    </form>
  );
}
