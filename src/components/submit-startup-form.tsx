import { Send } from "lucide-react";

import { suggestStartup } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SubmitStartupForm() {
  return (
    <form action={suggestStartup} className="flex w-full gap-2 sm:w-auto">
      <Input
        name="startup_name"
        minLength={2}
        maxLength={120}
        required
        placeholder="e.g. Figma, Webflow, Stripe..."
        className="h-9 min-w-0 sm:w-[230px]"
      />
      <Button type="submit" size="sm" className="h-9 shrink-0 font-mono">
        suggest
        <Send className="size-3.5" aria-hidden="true" />
      </Button>
    </form>
  );
}
