"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createWorkspace(formData: FormData) {
  const gymName = formData.get("gymName") as string;
  const fullName = formData.get("fullName") as string;
  
  if (!gymName || !fullName) {
    return { error: "Gym Name and Full Name are required." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  // 1. Create a Gym record using the user's input
  // Since we don't have slug on the form, we can auto-generate a slug from the name.
  // Replacing spaces with hyphens, lowercasing, and appending random string just in case
  const slug = gymName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substring(2, 8);

  const { data: gym, error: gymError } = await supabase
    .from("gyms")
    .insert({
      name: gymName,
      slug: slug,
    })
    .select()
    .single();

  if (gymError || !gym) {
    console.error("Gym Error", gymError);
    return { error: "Failed to create Gym profile." };
  }

  // 2. Insert into internal Users table as an Owner.
  const { error: userError } = await supabase
    .from("users")
    .insert({
      id: user.id,
      gym_id: gym.id,
      email: user.email,
      full_name: fullName,
      role: "owner",
    });

  if (userError) {
    console.error("User Error", userError);
    // Best practice: Rollback gym if user insertion fails
    await supabase.from("gyms").delete().eq("id", gym.id);
    return { error: "Failed to register Staff profile." };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
