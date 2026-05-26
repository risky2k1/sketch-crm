import { NextResponse } from "next/server";

import { calendarEventSchema } from "@/features/calendar/schema";
import { regenerateEventNotifications } from "@/features/calendar/notification-service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!workspaceId) {
    return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
  }

  let query = supabase
    .from("calendar_events")
    .select("*,calendar_event_reminders(*)")
    .eq("workspace_id", workspaceId)
    .order("starts_at", { ascending: true });

  if (start) query = query.gte("starts_at", start);
  if (end) query = query.lte("starts_at", end);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ events: data ?? [] });
}

export async function POST(request: Request) {
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
  const { reminders, ...eventData } = eventInput;

  const { data, error } = await supabase
    .from("calendar_events")
    .insert({ ...eventData, created_by: user.id, updated_by: user.id })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Failed to create event" }, { status: 400 });
  }

  await regenerateEventNotifications({
    eventId: data.id,
    actorId: user.id,
    workspaceId: eventInput.workspace_id,
    event: { ...eventInput, reminders },
  });

  return NextResponse.json({ id: data.id }, { status: 201 });
}
