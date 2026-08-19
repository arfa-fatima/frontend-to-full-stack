import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { claimAdminRole } from "@/lib/admin.functions";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — FlowPilot" },
      { name: "description", content: "Manage FlowPilot products, blog posts and contact messages." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "FlowPilot Admin" },
      { property: "og:description", content: "Internal FlowPilot management dashboard." },
    ],
  }),
  component: Admin,
});

type Product = { id: string; name: string; category: string; price: number };
type Post = {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string | null;
  image_url: string | null;
};

function Admin() {
  const { user, isAdmin, loading, profile, signOut } = useAuth();
  const claim = useMutation({
    mutationFn: () => claimAdminRole(),
    onSuccess: () => {
      toast.success("Admin access granted");
      window.location.reload();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (loading) {
    return (
      <div className="container-page py-20">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-6 h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <span className="eyebrow">Admin</span>
          <h1 className="mt-2 font-display text-2xl font-bold">Sign in to continue</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            The FlowPilot dashboard is available to administrators. Sign in with your admin
            account to manage products, posts and messages.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/signup">Create an account</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/">Back to site</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-page flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
          <span className="eyebrow">Admin</span>
          <h1 className="mt-2 font-display text-2xl font-bold">Admin access required</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            You're signed in as {profile?.email ?? user.email}, but this dashboard is limited to
            administrators.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={() => claim.mutate()} disabled={claim.isPending}>
              {claim.isPending ? "Granting..." : "Claim admin access"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Works only while no administrator exists yet.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Back to site</Link>
            </Button>
            <Button variant="ghost" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-soft">
      <header className="border-b border-border bg-card">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <span className="eyebrow">Admin</span>
            <h1 className="font-display text-2xl font-bold">FlowPilot dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/">View site</Link>
            </Button>
            <Button variant="outline" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container-page py-10">
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="posts">Blog posts</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-6">
            <ProductsPanel />
          </TabsContent>
          <TabsContent value="posts" className="mt-6">
            <PostsPanel />
          </TabsContent>
          <TabsContent value="messages" className="mt-6">
            <MessagesPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ProductsPanel() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category, price")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  const save = useMutation({
    mutationFn: async (values: Omit<Product, "id"> & { id?: string }) => {
      if (values.id) {
        const { error } = await supabase
          .from("products")
          .update({ name: values.name, category: values.category, price: values.price })
          .eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert({
          name: values.name,
          category: values.category,
          price: values.price,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
      setEditing(null);
      toast.success("Product saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    save.mutate({
      ...(editing ? { id: editing.id } : {}),
      name: String(form.get("name")).trim().slice(0, 150),
      category: String(form.get("category")).trim().slice(0, 80),
      price: Number(form.get("price")),
    });
  }

  return (
    <Panel
      title="Products"
      action={
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> Add product
        </Button>
      }
    >
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : data && data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(product);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove.mutate(product.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">No products yet.</p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit product" : "Add product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={editing?.name ?? ""} maxLength={150} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                defaultValue={editing?.category ?? ""}
                maxLength={80}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={editing?.price ?? 0}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Saving..." : "Save product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Panel>
  );
}

function PostsPanel() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, category, date, content, image_url")
        .order("date", { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  const save = useMutation({
    mutationFn: async (values: Omit<Post, "id"> & { id?: string }) => {
      const payload = {
        title: values.title,
        category: values.category,
        date: values.date,
        content: values.content,
        image_url: values.image_url,
      };
      if (values.id) {
        const { error } = await supabase.from("posts").update(payload).eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("posts")
          .insert({ ...payload, author_id: user?.id ?? null });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      setOpen(false);
      setEditing(null);
      toast.success("Post saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const imageUrl = String(form.get("image_url")).trim();
    const content = String(form.get("content")).trim();
    save.mutate({
      ...(editing ? { id: editing.id } : {}),
      title: String(form.get("title")).trim().slice(0, 200),
      category: String(form.get("category")).trim().slice(0, 80),
      date: String(form.get("date")),
      content: content ? content.slice(0, 20000) : null,
      image_url: imageUrl ? imageUrl.slice(0, 500) : null,
    });
  }

  return (
    <Panel
      title="Blog posts"
      action={
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> Add post
        </Button>
      }
    >
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : data && data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(post);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove.mutate(post.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">No posts yet.</p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit post" : "Add post"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={editing?.title ?? ""} maxLength={200} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="post-category">Category</Label>
                <Input
                  id="post-category"
                  name="category"
                  defaultValue={editing?.category ?? ""}
                  maxLength={80}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={editing?.date ?? new Date().toISOString().slice(0, 10)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                defaultValue={editing?.image_url ?? ""}
                maxLength={500}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" name="content" rows={6} defaultValue={editing?.content ?? ""} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Saving..." : "Save post"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Panel>
  );
}

function MessagesPanel() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, name, email, company, subject, message, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Message deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Panel title="Contact messages">
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : data && data.length > 0 ? (
        <div className="space-y-4">
          {data.map((message) => (
            <article key={message.id} className="rounded-xl border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{message.subject}</h3>
                  <p className="text-xs text-muted-foreground">
                    {message.name} · {message.email}
                    {message.company ? ` · ${message.company}` : ""} ·{" "}
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(message.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                {message.message}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-muted-foreground">No messages yet.</p>
      )}
    </Panel>
  );
}
