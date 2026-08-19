import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Bootstrap helper: the first signed-in user who claims admin access becomes the
 * ADMIN. Once any admin exists, the claim is rejected.
 */
export const claimAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "ADMIN");
    if (existingError) throw new Error(existingError.message);

    if (existing && existing.length > 0) {
      if (existing.some((row) => row.user_id === context.userId)) {
        return { granted: true as const, alreadyAdmin: true as const };
      }
      throw new Error("An administrator already exists for this project.");
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "ADMIN" });
    if (error) throw new Error(error.message);

    return { granted: true as const, alreadyAdmin: false as const };
  });
