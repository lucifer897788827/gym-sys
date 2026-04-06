"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getWorkspace } from "@/lib/supabase/queries";
import { leadFormSchema } from "./schema";
import { revalidatePath } from "next/cache";

export async function createLead(formData: FormData) {
  const workspace = await getWorkspace();
  if (!workspace?.gymId) {
    return { error: "Not authenticated or gym not set up." };
  }

  const rawData = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    source: formData.get("source"),
  };

  const validated = leadFormSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("leads").insert({
    gym_id: workspace.gymId,
    full_name: validated.data.name,
    phone: validated.data.phone,
    source: validated.data.source || "walk-in",
    status: "new",
    created_by_user_id: workspace.userId,
  });

  if (error) {
    console.error("Lead Insertion Error:", error);
    if (error.code === '23505') {
       return { error: "A lead with this phone number already exists." };
    }
    return { error: "Failed to create lead. Please try again." };
  }

  revalidatePath("/leads");
  return { success: true };
}
