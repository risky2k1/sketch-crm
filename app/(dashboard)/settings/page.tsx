import Link from "next/link";

import { ModuleHeader } from "@/components/layout/module-header";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { buttonVariants } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <ModuleHeader title="Settings" prefix="Workspace" />
      <AppearanceSettings />
      <Link href="/settings/workspace" className={buttonVariants({ variant: "outline" })}>
        Open workspace settings
      </Link>
    </div>
  );
}
