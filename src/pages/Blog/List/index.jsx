import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Footer } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePublicBlogs } from "@/features/publicBlog/hooks";

export default function BlogListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePublicBlogs({ page, limit: 10 });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-24">
        <h1 className="text-3xl font-semibold">Blog</h1>
        <p className="mt-2 text-muted-foreground">Stories and updates from the Tamil Jains community.</p>

        <div className="mt-8 space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {isError && <p className="text-sm text-destructive">Failed to load posts.</p>}
          {data && data.blogs.length === 0 && (
            <p className="text-sm text-muted-foreground">No posts yet — check back soon.</p>
          )}
          {data?.blogs.map((blog) => (
            <Card key={blog.slug}>
              {blog.coverImage && (
                <img src={blog.coverImage} alt={blog.title} className="h-48 w-full rounded-t-xl object-cover" />
              )}
              <CardHeader>
                <CardTitle>{blog.title}</CardTitle>
                {blog.excerpt && <CardDescription>{blog.excerpt}</CardDescription>}
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-wrap gap-2">
                  {blog.categories.map((c) => (
                    <Badge key={c.slug} variant="secondary">
                      {c.name}
                    </Badge>
                  ))}
                </div>
                <Button asChild>
                  <Link to={`/blog/${blog.slug}`}>Read more</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {data && data.pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
