"use client";

import { Button } from "@/components/ui/button";

export function CompanyDeleteButton({
  action,
  name,
}: {
  action: () => Promise<void>;
  name: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${name}? This action cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="destructive" size="sm">
        Delete
      </Button>
    </form>
  );
}
