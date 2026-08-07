import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Navbar, Footer } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePublicBlog } from "@/features/publicBlog/hooks";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { data: blog, isLoading, isError } = usePublicBlog(slug);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-24">
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {isError && <p className="text-sm text-destructive">Post not found.</p>}
        {blog && (
          <>
            <h1 className="text-3xl font-semibold">{blog.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {blog.author ? `By ${blog.author} · ` : ""}
              {blog.publishedAt && new Date(blog.publishedAt).toLocaleDateString()}
              {blog.readingTime ? ` · ${blog.readingTime} min read` : ""}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {blog.categories.map((c) => (
                <Badge key={c.slug} variant="secondary">
                  {c.name}
                </Badge>
              ))}
              {blog.tags.map((t) => (
                <Badge key={t.slug} variant="outline">
                  {t.name}
                </Badge>
              ))}
            </div>

            {blog.coverImage && (
              <img src={blog.coverImage} alt={blog.title} className="mt-6 w-full rounded-xl object-cover" />
            )}

            <article className="prose prose-neutral mt-8 max-w-none">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </article>

            {blog.relatedBlogs.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-semibold">Related posts</h2>
                <div className="mt-4 space-y-4">
                  {blog.relatedBlogs.map((related) => (
                    <Card key={related.slug}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          <Link to={`/blog/${related.slug}`} className="hover:underline">
                            {related.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      {related.excerpt && (
                        <CardContent className="text-sm text-muted-foreground">{related.excerpt}</CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
