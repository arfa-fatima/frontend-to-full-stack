import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Grants the ADMIN role to the signed-in user via a database function.
 * The database decides eligibility (email on the admin list, no admin yet, or
 * already an admin), so no service-role key is needed.
 */
export const claimAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase.rpc("claim_admin_role");
    if (error) throw new Error(error.message);
    return { granted: true as const };
  });
