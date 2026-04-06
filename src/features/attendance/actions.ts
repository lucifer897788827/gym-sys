"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getWorkspace } from "@/lib/supabase/queries";
import { revalidatePath } from "next/cache";

export async function fetchAttendanceToday() {
  const workspace = await getWorkspace();
  if (!workspace?.gymId) return { error: "Not authenticated" };

  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("attendance_logs")
    .select(`
      *,
      member:members(full_name)
    `)
    .eq("gym_id", workspace.gymId)
    .gte("check_in_at", `${today}T00:00:00Z`)
    .lte("check_in_at", `${today}T23:59:59Z`)
    .order("check_in_at", { ascending: false });

  if (error) {
    console.error("Error fetching attendance:", error);
    return { error: "Failed to fetch today's attendance" };
  }

  return { attendance: data };
}

export async function markAttendance(memberId: string) {
  const workspace = await getWorkspace();
  if (!workspace?.gymId) return { error: "Not authenticated" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("attendance_logs")
    .insert({
      gym_id: workspace.gymId,
      member_id: memberId,
      source: "manual"
    });

  if (error) {
    console.error("Error marking attendance:", error);
    return { error: "Failed to mark attendance" };
  }

  revalidatePath("/attendance");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function fetchAttendanceStats() {
  const workspace = await getWorkspace();
  if (!workspace?.gymId) return { error: "Not authenticated" };

  const supabase = await createSupabaseServerClient();
  
  // Fetch count of check-ins today
  const today = new Date().toISOString().split("T")[0];
  const { count: todayCount, error: countError } = await supabase
    .from("attendance_logs")
    .select("*", { count: "exact", head: true })
    .eq("gym_id", workspace.gymId)
    .gte("check_in_at", `${today}T00:00:00Z`);

  // Fetch unique members check-ins for the last 7 days for a simple activity view
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  
  const { data: recentData, error: recentError } = await supabase
    .from("attendance_logs")
    .select("check_in_at")
    .eq("gym_id", workspace.gymId)
    .gte("check_in_at", last7Days.toISOString())
    .order("check_in_at", { ascending: false });

  return {
    todayCount: todayCount || 0,
    recentVisits: recentData?.map(d => d.check_in_at.split("T")[0]) || [],
  };
}
