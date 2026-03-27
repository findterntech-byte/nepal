import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

export default function BlogPost() {
  const params = useParams();
  const slug = (params as any).slug;

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      return res.json();
    },
    enabled: !!slug,
  });

  if (isLoading) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-24">Loading...</div>
      <Footer />
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-24">Post not found.</div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.authorName || "Admin"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.publishedAt ? new Date(post.publishedAt).toDateString() : ""}</span>
            </div>
          </div>

          {post.coverImageUrl && (
            <div className="mb-6">
              <img src={post.coverImageUrl} alt={post.title} className="w-full h-[420px]  rounded-lg" />
            </div>
          )}

          <Card>
            <CardContent>
              {/* If content is HTML, render as HTML. Otherwise fall back to plain text. */}
              {typeof post.content === "string" && /</.test(post.content) ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <div className="prose max-w-none whitespace-pre-wrap">{post.content}</div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 flex gap-4">
            <Link to="/blog">
              <Button variant="outline">Back to Blog</Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
