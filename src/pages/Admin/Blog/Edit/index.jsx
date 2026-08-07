import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import BlogForm from "@/features/blog/BlogForm";
import { useBlog, useUpdateBlog } from "@/features/blog/hooks";

export default function AdminBlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: blog, isLoading } = useBlog(id);
  const updateBlog = useUpdateBlog(id);

  const handleSubmit = async (values) => {
    try {
      await updateBlog.mutateAsync(values);
      toast.success("Post updated");
      navigate("/admin/blog");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update post");
    }
  };

  if (isLoading) return <p className="text-sm text-muted-foreground p-8 text-center">Loading article content...</p>;
  if (!blog) return <p className="text-sm text-destructive p-8 text-center">Post not found.</p>;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/blog"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
            Edit Post: {blog.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Update blog post content, summary, and categories
          </p>
        </div>
      </div>

      <BlogForm
        defaultValues={{
          title: blog.title,
          excerpt: blog.excerpt ?? "",
          content: blog.content,
          coverImage: blog.coverImage ?? "",
          categoryIds: blog.categories.map((c) => c.id),
          tagIds: blog.tags.map((t) => t.id),
          seoTitle: blog.seoTitle ?? "",
          seoDescription: blog.seoDescription ?? "",
          canonicalUrl: blog.canonicalUrl ?? "",
          isFeatured: blog.isFeatured,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateBlog.isPending}
        submitLabel="Save Changes"
      />
    </div>
  );
}
