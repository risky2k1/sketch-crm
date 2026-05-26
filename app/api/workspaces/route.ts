import { NextResponse } from "next/server";

import { createWorkspaceSchema } from "@/features/workspaces/schema";
import { createWorkspace, ensureProfileForCurrentUser, getUserWorkspaces } from "@/lib/supabase/workspaces";

export async function GET() {
  try {
    const workspaces = await getUserWorkspaces();
    return NextResponse.json({ workspaces });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to load workspaces." }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureProfileForCurrentUser();
    const body = await request.json();
    const parsed = createWorkspaceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
    }

    const workspace = await createWorkspace(parsed.data.name);
    return NextResponse.json({ workspace }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create workspace." }, { status: 400 });
  }
}
