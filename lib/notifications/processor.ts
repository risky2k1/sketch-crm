import { sendNotificationEmail } from "@/lib/notifications/email";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function processPendingNotifications(limit = 100) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("status", "pending")
    .lte("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: true })
    .limit(limit);

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to load pending notifications.");
  }

  for (const item of data) {
    try {
      if (Array.isArray(item.channels) && item.channels.includes("email")) {
        await sendNotificationEmail({
          toUserId: item.recipient_id,
          title: item.title,
          body: item.body,
          metadata: typeof item.metadata === "object" && item.metadata ? (item.metadata as Record<string, unknown>) : undefined,
        });
      }

      await supabase.from("notifications").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", item.id);
    } catch {
      await supabase.from("notifications").update({ status: "failed" }).eq("id", item.id);
    }
  }
}
