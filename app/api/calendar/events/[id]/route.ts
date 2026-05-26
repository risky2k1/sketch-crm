import { NextResponse } from "next/server";

import { regenerateEventNotifications } from "@/features/calendar/notification-service";
import { calendarEventSchema } from "@/features/calendar/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = calendarEventSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const eventInput = parsed.data;
  const { reminders, ...eventDataWithWorkspace } = eventInput;
  const { workspace_id, ...eventData } = eventDataWithWorkspace;

  const { error } = await supabase.from("calendar_events").update({ ...eventData, updated_by: user.id }).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await regenerateEventNotifications({
    eventId: id,
    actorId: user.id,
    workspaceId: workspace_id,
    event: { ...eventInput, reminders },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase.from("calendar_events").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
