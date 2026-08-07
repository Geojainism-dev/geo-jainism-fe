import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Search,
  Download,
  CheckCircle,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Star,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/Combobox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useBlogs, useDeleteBlog, usePublishBlog, useArchiveBlog } from "@/features/blog/hooks";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function AdminBlogList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading, isError } = useBlogs({
    page,
    limit: pageSize,
    ...(status && { status }),
  });
  const deleteBlog = useDeleteBlog();
  const publishBlog = usePublishBlog();
  const archiveBlog = useArchiveBlog();

  const handleDelete = async (id) => {
    try {
      await deleteBlog.mutateAsync(id);
      toast.success("Post deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishBlog.mutateAsync(id);
      toast.success("Post published");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to publish post");
    }
  };

  const handleArchive = async (id) => {
    try {
      await archiveBlog.mutateAsync(id);
      toast.success("Post archived");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to archive post");
    }
  };

  const blogs = data?.blogs ?? [];
  const totalItems = data?.pagination?.totalItems ?? blogs.length;
  const totalPages = data?.pagination?.totalPages ?? 1;

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const query = searchQuery.toLowerCase().trim();
      return !query || blog.title?.toLowerCase().includes(query);
    });
  }, [blogs, searchQuery]);

  // Overview stats
  const totalCount = totalItems;
  const publishedCount = blogs.filter((b) => b.status === "PUBLISHED").length;
  const draftCount = blogs.filter((b) => b.status === "DRAFT" || b.status === "ARCHIVED").length;

  return (
    <div className="space-y-6">
      {/* 1. Page Header matching table.png */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200/60 bg-emerald-50 text-emerald-600 shadow-2xs dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-400">
            <FileText className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              Blog Post Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Manage and track all blog posts and articles
            </p>
          </div>
        </div>

        <Button
          asChild
          size="default"
          className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs dark:bg-slate-100 dark:text-slate-900 px-4 py-2.5"
        >
          <Link to="/admin/blog/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>New Post</span>
          </Link>
        </Button>
      </div>

      {/* 2. Top Stats Overview Cards matching table.png */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card 1: Total Posts */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {totalCount}
            </span>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              TOTAL POSTS
            </p>
          </div>
        </div>

        {/* Card 2: Published Posts */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-100/70 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {publishedCount}
            </span>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              PUBLISHED
            </p>
          </div>
        </div>

        {/* Card 3: Draft / Archived */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100/70 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {draftCount}
            </span>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              DRAFT / ARCHIVED
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Table Card Container matching table.png */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Table Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-64 sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by post title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/80 pl-9 pr-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Select Dropdown with label */}
            <div className="relative">
              <span className="absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider z-10">
                Status
              </span>
              <Combobox
                value={status || "all"}
                onChange={(value) => {
                  setStatus(value === "all" ? "" : value);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "All Statuses" },
                  ...STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
                ]}
                searchable={false}
                triggerClassName="min-w-[9rem]"
              />
            </div>
          </div>

          {/* Export Button matching table.png */}
          <button
            type="button"
            onClick={() => toast.success("Exporting blog posts...")}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <th className="py-3.5 px-5">POST TITLE</th>
                <th className="py-3.5 px-5">STATUS</th>
                <th className="py-3.5 px-5">FEATURED</th>
                <th className="py-3.5 px-5">VIEWS</th>
                <th className="py-3.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                      <span>Loading blog posts...</span>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty State matching table.png */}
              {!isLoading && filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="mx-auto flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600">
                        <FileText className="h-10 w-10" />
                      </div>
                      <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                        No Posts Found
                      </h3>
                      <p className="text-xs text-slate-400">
                        Write a new post or adjust your search filters.
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="mt-2 bg-slate-900 text-white hover:bg-slate-800"
                      >
                        <Link to="/admin/blog/new" className="gap-1.5">
                          <Plus className="h-4 w-4" /> New Post
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Populated Rows */}
              {!isLoading &&
                filteredBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-4 px-5 font-bold text-slate-900 dark:text-slate-100">
                      {blog.title}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold border",
                          blog.status === "PUBLISHED"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-300"
                            : blog.status === "DRAFT"
                            ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/60 dark:border-amber-900 dark:text-amber-300"
                            : "bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        )}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-600 dark:text-slate-400">
                      {blog.isFeatured ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-300">
                          <Star className="h-3 w-3 fill-purple-600" /> Featured
                        </span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5 text-slate-400" />
                        {blog.views ?? 0}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                          asChild
                        >
                          <Link to={`/admin/blog/${blog.id}/edit`}>
                            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                          </Link>
                        </Button>

                        {blog.status !== "PUBLISHED" && (
                          <Button
                            size="sm"
                            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                            onClick={() => handlePublish(blog.id)}
                          >
                            Publish
                          </Button>
                        )}

                        {blog.status !== "ARCHIVED" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-semibold"
                            onClick={() => handleArchive(blog.id)}
                          >
                            <Archive className="h-3.5 w-3.5 mr-1" /> Archive
                          </Button>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This can't be undone. "{blog.title}" will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(blog.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* 4. Table Pagination Footer matching table.png */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-5 py-3.5 text-xs text-slate-500 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <Combobox
              value={pageSize}
              onChange={(value) => {
                setPageSize(value);
                setPage(1);
              }}
              options={[10, 20, 50].map((n) => ({ value: n, label: String(n) }))}
              searchable={false}
              triggerClassName="w-16 rounded-md px-2 py-1"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium">
              {filteredBlogs.length === 0
                ? "0-0 of 0"
                : `${(page - 1) * pageSize + 1}-${Math.min(
                    page * pageSize,
                    totalItems
                  )} of ${totalItems}`}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded-md border border-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
