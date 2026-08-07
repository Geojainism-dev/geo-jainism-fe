import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import BlogForm from "@/features/blog/BlogForm";
import { useCreateBlog } from "@/features/blog/hooks";

export default function AdminBlogNew() {
  const navigate = useNavigate();
  const createBlog = useCreateBlog();

  const handleSubmit = async (values) => {
    try {
      await createBlog.mutateAsync(values);
      toast.success("Post created");
      navigate("/admin/blog");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    }
  };

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
            Create New Blog Post
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Write article title, summary, content &amp; SEO parameters
          </p>
        </div>
      </div>

      <BlogForm onSubmit={handleSubmit} isSubmitting={createBlog.isPending} submitLabel="Publish Post" />
    </div>
  );
}
