"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getWorkspace } from "@/lib/supabase/queries";
import { revalidatePath } from "next/cache";

export async function fetchMembers() {
  const workspace = await getWorkspace();
  if (!workspace?.gymId) {
    return { error: "Not authenticated" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("gym_id", workspace.gymId)
    .order("full_name");

  if (error) {
    console.error("Error fetching members:", error);
    return { error: "Failed to fetch members" };
  }

  return { members: data };
}

// Additional member management actions like updating state or notes can be added here
export async function updateMemberNote(memberId: string, note: string) {
  const workspace = await getWorkspace();
  if (!workspace?.gymId) return { error: "Not authenticated" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("members")
    .update({ notes: note })
    .eq("id", memberId)
    .eq("gym_id", workspace.gymId);

  if (error) return { error: "Failed to update note" };

  revalidatePath("/members");
  return { success: true };
}
