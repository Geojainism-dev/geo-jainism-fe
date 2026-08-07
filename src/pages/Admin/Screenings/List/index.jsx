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
  Calendar,
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
import { useScreenings, useDeleteScreening } from "@/features/screenings/hooks";
import { cn } from "@/lib/utils";

export default function AdminScreeningsList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const { data, isLoading, isError } = useScreenings({ page, limit: pageSize });
  const deleteScreening = useDeleteScreening();

  const handleDelete = async (id) => {
    try {
      await deleteScreening.mutateAsync(id);
      toast.success("Event deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete event");
    }
  };

  const screenings = data?.screenings ?? [];
  const totalItems = data?.pagination?.totalItems ?? screenings.length;
  const totalPages = data?.pagination?.totalPages ?? 1;

  // Filtered screenings based on search query and status filter
  const filteredScreenings = useMemo(() => {
    return screenings.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.venue?.toLowerCase().includes(query) ||
        item.city?.toLowerCase().includes(query);

      const matchesType =
        selectedType === "all" ||
        (selectedType === "active" && item.isActive) ||
        (selectedType === "draft" && !item.isActive);

      return matchesSearch && matchesType;
    });
  }, [screenings, searchQuery, selectedType]);

  // Compute stat counts
  const totalCount = totalItems;
  const activeCount = screenings.filter((s) => s.isActive).length;
  const draftCount = screenings.filter((s) => !s.isActive).length;

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
              Event Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Manage and track all events and screenings
            </p>
          </div>
        </div>

        <Button
          asChild
          size="default"
          className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs dark:bg-slate-100 dark:text-slate-900 px-4 py-2.5"
        >
          <Link to="/admin/events/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Event</span>
          </Link>
        </Button>
      </div>

      {/* 2. Top Stats Overview Cards matching table.png */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card 1: Total Events */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {totalCount}
            </span>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              TOTAL EVENTS
            </p>
          </div>
        </div>

        {/* Card 2: Active Events */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-100/70 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {activeCount}
            </span>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              ACTIVE EVENTS
            </p>
          </div>
        </div>

        {/* Card 3: Draft Events */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100/70 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {draftCount}
            </span>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              DRAFT EVENTS
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
                placeholder="Search by title, venue or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/80 pl-9 pr-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Select Dropdown with label */}
            <div className="relative">
              <span className="absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider z-10">
                Event Status
              </span>
              <Combobox
                value={selectedType}
                onChange={setSelectedType}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "active", label: "Active" },
                  { value: "draft", label: "Draft / Inactive" },
                ]}
                searchable={false}
                triggerClassName="min-w-[9rem]"
              />
            </div>
          </div>

          {/* Export Button matching table.png */}
          <button
            type="button"
            onClick={() => toast.success("Exporting events list...")}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            {/* Table Header matching table.png */}
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <th className="py-3.5 px-5">EVENT TITLE</th>
                <th className="py-3.5 px-5">DATE &amp; TIME</th>
                <th className="py-3.5 px-5">VENUE</th>
                <th className="py-3.5 px-5">CITY</th>
                <th className="py-3.5 px-5">STATUS</th>
                <th className="py-3.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                      <span>Loading events data...</span>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty State matching table.png document icon & layout */}
              {!isLoading && filteredScreenings.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="mx-auto flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600">
                        <FileText className="h-10 w-10" />
                      </div>
                      <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                        No Events Found
                      </h3>
                      <p className="text-xs text-slate-400">
                        Add a new event or adjust your search filters.
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="mt-2 bg-slate-900 text-white hover:bg-slate-800"
                      >
                        <Link to="/admin/events/new" className="gap-1.5">
                          <Plus className="h-4 w-4" /> Add Event
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Populated Rows */}
              {!isLoading &&
                filteredScreenings.map((screening) => (
                  <tr
                    key={screening.id}
                    className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-4 px-5 font-bold text-slate-900 dark:text-slate-100">
                      {screening.title}
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {screening.localDate || screening.date || "TBD"}, {screening.localTime || ""}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-600 dark:text-slate-400">
                      {screening.venue || "—"}
                    </td>
                    <td className="py-4 px-5 text-slate-600 dark:text-slate-400">
                      {screening.city || "—"}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold border",
                          screening.isActive
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-900 dark:text-emerald-300"
                            : "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/60 dark:border-amber-900 dark:text-amber-300"
                        )}
                      >
                        {screening.isActive ? "Active" : "Draft"}
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
                          <Link to={`/admin/events/${screening.id}/edit`}>
                            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                          </Link>
                        </Button>

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
                              <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This can't be undone. "{screening.title}" will be permanently removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(screening.id)}>
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
              {filteredScreenings.length === 0
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
