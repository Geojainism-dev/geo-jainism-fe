import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  FileText,
  Search,
  Download,
  Users,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Combobox from "@/components/ui/Combobox";
import {
  useScreeningRegistrations,
  useCheckInScreeningRegistration,
} from "@/features/screeningRegistrations/adminHooks";
import { getExportUrl } from "@/features/screeningRegistrations/adminApi";
import { useScreenings } from "@/features/screenings/hooks";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = ["REGISTERED", "CHECKED_IN", "CANCELLED"];

const statusVariant = (status) => {
  if (status === "SENT" || status === "CHECKED_IN")
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300";
  if (status === "FAILED" || status === "CANCELLED")
    return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300";
  if (status === "REGISTERED")
    return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300";
  return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300";
};

export default function AdminScreeningRegistrationsList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [screeningId, setScreeningId] = useState("");
  const [status, setStatus] = useState("");
  const [checkinCode, setCheckinCode] = useState("");

  const { data: screeningsData } = useScreenings({ page: 1, limit: 100 });
  const { data, isLoading, isError } = useScreeningRegistrations({
    page,
    limit: pageSize,
    ...(screeningId && { screeningId }),
    ...(status && { status }),
  });
  const checkIn = useCheckInScreeningRegistration();

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!checkinCode) return;
    try {
      const registration = await checkIn.mutateAsync(checkinCode);
      toast.success(`Checked in: ${registration.name}`);
      setCheckinCode("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Check-in failed");
    }
  };

  const registrations = data?.registrations ?? [];
  const totalItems = data?.pagination?.totalItems ?? registrations.length;
  const totalPages = data?.pagination?.totalPages ?? 1;

  // Overview stats
  const totalCount = totalItems;
  const checkedInCount = registrations.filter((r) => r.status === "CHECKED_IN").length;
  const registeredCount = registrations.filter((r) => r.status === "REGISTERED").length;

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
              Registration Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Manage and track event registrations and check-ins
            </p>
          </div>
        </div>

        {/* Quick Check-in form */}
        <form onSubmit={handleCheckIn} className="flex items-center gap-2">
          <input
            type="text"
            value={checkinCode}
            onChange={(e) => setCheckinCode(e.target.value)}
            placeholder="8-digit check-in code"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 w-44"
          />
          <Button
            type="submit"
            disabled={checkIn.isPending}
            className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2"
          >
            <UserCheck className="h-4 w-4 mr-1" />
            {checkIn.isPending ? "Checking..." : "Check In"}
          </Button>
        </form>
      </div>

      {/* 2. Top Stats Overview Cards matching table.png */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card 1: Total Registrations */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {totalCount}
            </span>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              TOTAL REGISTRATIONS
            </p>
          </div>
        </div>

        {/* Card 2: Checked In */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-100/70 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {checkedInCount}
            </span>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              CHECKED IN
            </p>
          </div>
        </div>

        {/* Card 3: Registered */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100/70 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {registeredCount}
            </span>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              REGISTERED
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Table Card Container matching table.png */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Table Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            {/* Event Filter Select */}
            <div className="relative">
              <span className="absolute -top-2 left-2 bg-white dark:bg-slate-900 px-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider z-10">
                Event
              </span>
              <Combobox
                value={screeningId || "all"}
                onChange={(value) => {
                  setScreeningId(value === "all" ? "" : value);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "All Events" },
                  ...(screeningsData?.screenings.map((s) => ({ value: s.id, label: s.title })) ?? []),
                ]}
                triggerClassName="max-w-xs min-w-[9rem]"
              />
            </div>

            {/* Status Filter Select */}
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

          {/* Export Buttons matching table.png */}
          <div className="flex items-center gap-2">
            <a
              href={getExportUrl({ screeningId, format: "xlsx" })}
              download
              className="flex items-center gap-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export .xlsx</span>
            </a>
            <a
              href={getExportUrl({ screeningId, format: "csv" })}
              download
              className="flex items-center gap-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-300"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export .csv</span>
            </a>
          </div>
        </div>

        {/* Table Content */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-y border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <th className="py-3.5 px-5">REGISTRATION CODE</th>
                <th className="py-3.5 px-5">NAME</th>
                <th className="py-3.5 px-5">EVENT</th>
                <th className="py-3.5 px-5">STATUS</th>
                <th className="py-3.5 px-5">WHATSAPP</th>
                <th className="py-3.5 px-5">EMAIL</th>
                <th className="py-3.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                      <span>Loading registrations...</span>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty State matching table.png icon & layout */}
              {!isLoading && registrations.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="mx-auto flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600">
                        <FileText className="h-10 w-10" />
                      </div>
                      <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                        No Registrations Found
                      </h3>
                      <p className="text-xs text-slate-400">
                        Registrations will show up here once people sign up for an event.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Populated Rows */}
              {!isLoading &&
                registrations.map((registration) => (
                  <tr
                    key={registration.id}
                    className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-4 px-5 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {registration.registrationCode}
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-900 dark:text-slate-100">
                      {registration.name}
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-600 dark:text-slate-400">
                      {registration.screening?.title ?? "—"}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold border",
                          statusVariant(registration.status)
                        )}
                      >
                        {registration.status}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold border",
                          statusVariant(registration.whatsappStatus)
                        )}
                      >
                        {registration.whatsappStatus}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold border",
                          statusVariant(registration.emailStatus)
                        )}
                      >
                        {registration.emailStatus}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
                        asChild
                      >
                        <Link to={`/admin/registrations/${registration.id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Link>
                      </Button>
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
              {registrations.length === 0
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
