import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout, PageHero } from "@/components/site/SiteLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — FlowPilot Journal on Automation & AI" },
      {
        name: "description",
        content:
          "Insights on automation, AI, productivity and modern teams from the FlowPilot journal.",
      },
      { property: "og:title", content: "FlowPilot Journal" },
      { property: "og:description", content: "Ideas for better, smarter work." },
    ],
  }),
  component: Blog,
});

function Blog() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, category, date, content, image_url")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow="FlowPilot Journal"
        title="Ideas for better, smarter work."
        subtitle="Insights on automation, AI, productivity and modern teams."
      />

      <section className="container-page py-20">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    loading="lazy"
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="brand-surface h-44 w-full" />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="eyebrow">{post.category}</span>
                    <time className="text-muted-foreground">
                      {new Date(post.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold">{post.title}</h2>
                  {post.content && (
                    <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">
                      {post.content}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <h2 className="text-lg font-semibold">No posts published yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              New articles from the FlowPilot team will appear here.
            </p>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
