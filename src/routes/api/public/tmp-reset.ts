import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/tmp-reset")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: list, error: listError } = await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });
        if (listError) return new Response(listError.message, { status: 500 });
        const target = list.users.find(
          (u) => u.email?.toLowerCase() === "tester123@example.com",
        );
        if (!target) return new Response("not found", { status: 404 });
        const { error } = await supabaseAdmin.auth.admin.updateUserById(target.id, {
          password: "admin123456",
          email_confirm: true,
        });
        if (error) return new Response(error.message, { status: 500 });
        return new Response(JSON.stringify({ ok: true, id: target.id }));
      },
    },
  },
});
