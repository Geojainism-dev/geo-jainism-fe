import { Briefcase, User, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CategoryFilter({
  categories = [],
  selectedCategories = [],
  onToggleCategory,
  eventCounts = {},
}) {
  if (categories.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center justify-between">
        <span>FILTERS</span>
        <Sparkles className="h-3 w-3 text-purple-600" />
      </h4>

      <div className="space-y-1.5">
        {categories.map((cat) => {
          const isChecked = selectedCategories.includes(cat.id);
          const count = eventCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onToggleCategory(cat.id)}
              className="flex w-full items-center justify-between py-1.5 px-2 rounded-lg text-xs font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/60"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors",
                    isChecked
                      ? cat.bgClass + " text-white"
                      : "border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900"
                  )}
                >
                  {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                </div>

                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {cat.name}
                </span>
              </div>

              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
