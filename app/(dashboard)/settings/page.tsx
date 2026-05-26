import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <p className="text-sm text-muted-foreground">Manage workspace settings and members.</p>
      <Link href="/settings/workspace" className={buttonVariants({ variant: "outline" })}>
        Open workspace settings
      </Link>
    </div>
  );
}
