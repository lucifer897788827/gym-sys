import { createSupabaseServerClient } from "./server";

export async function getWorkspace() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  // Find their internal user record
  const { data: dbUser, error: dbError } = await supabase
    .from("users")
    .select("gym_id, role, full_name")
    .eq("id", user.id)
    .single();

  if (dbError || !dbUser) {
    return {
      userId: user.id,
      email: user.email!,
      gymId: null,
      role: null,
      fullName: null,
    };
  }

  return {
    userId: user.id,
    email: user.email!,
    gymId: dbUser.gym_id,
    role: dbUser.role,
    fullName: dbUser.full_name,
  };
}
