import { useState, useMemo } from "react";
import {
  FileText,
  Search,
  Download,
  Shield,
  ShieldCheck,
  UserCog,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/Combobox";
import { useAdmins } from "@/features/users/hooks";
import { cn } from "@/lib/utils";

export default function AdminUsersList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError } = useAdmins({ page: 1, limit: 50 });

  const users = data?.users ?? [];

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = searchQuery.toLowerCase().trim();
      return !query || u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query);
    });
  }, [users, searchQuery]);

  const totalCount = users.length;
  const superAdminCount = users.filter((u) => u.role === "SUPER_ADMIN" || u.role === "ADMIN").length;

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
              Administrator Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Manage system administrators and security role permissions
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top Stats Overview Cards matching table.png */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Card 1: Total Admins */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <UserCog className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {totalCount}
            </span>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              TOTAL ADMINS
            </p>
          </div>
        </div>

        {/* Card 2: Active Privileges */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-100/70 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {superAdminCount}
            </span>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              ADMINISTRATORS
            </p>
          </div>
        </div>

        {/* Card 3: Security Level */}
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100/70 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              High
            </span>
            <p className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
              SECURITY PRIVILEGES
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Table Card Container matching table.png */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Table Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="relative w-64 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search administrator name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/80 pl-9 pr-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            type="button"
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
                <th className="py-3.5 px-5">ADMIN NAME</th>
                <th className="py-3.5 px-5">EMAIL ADDRESS</th>
                <th className="py-3.5 px-5">ROLE</th>
                <th className="py-3.5 px-5">STATUS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                      <span>Loading administrators...</span>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty State matching table.png */}
              {!isLoading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="mx-auto flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600">
                        <FileText className="h-10 w-10" />
                      </div>
                      <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                        No Administrators Found
                      </h3>
                      <p className="text-xs text-slate-400">
                        No administrators registered in the system.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Populated Rows */}
              {!isLoading &&
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-4 px-5 font-bold text-slate-900 dark:text-slate-100">
                      {user.name}
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-600 dark:text-slate-400">
                      {user.email}
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1 rounded-md border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:border-purple-900 dark:bg-purple-950/60 dark:text-purple-300">
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Active Administrator
                      </span>
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
              {filteredUsers.length === 0
                ? "0-0 of 0"
                : `1-${filteredUsers.length} of ${filteredUsers.length}`}
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
                disabled={page >= 1}
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
