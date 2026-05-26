import { NextResponse } from "next/server";

import { getWorkspaceMembers } from "@/lib/supabase/workspaces";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const members = await getWorkspaceMembers(id);
    return NextResponse.json({ members });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load members." }, { status: 400 });
  }
}
