import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DEFAULT_TRIGGER_CLASSES =
  "inline-flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/60";

// cmdk's default filter is a loose fuzzy-subsequence match, which on a long list
// (e.g. 400 IANA timezones) surfaces unrelated results for a specific query like
// "Kolkata". Plain case-insensitive substring matching is more predictable here.
function substringFilter(itemValue, search, keywords) {
  if (!search) return 1;
  const haystack = [itemValue, ...(keywords ?? [])].join(" ").toLowerCase();
  return haystack.includes(search.trim().toLowerCase()) ? 1 : 0;
}

// Single reusable dropdown for the whole app: a styled trigger button + searchable
// popover list, built on Popover/Command so behaviour (keyboard nav, filtering,
// grouping) is consistent everywhere instead of re-implemented per native <select>.
export default function Combobox({
  id,
  value,
  onChange,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  searchable,
  disabled = false,
  icon: Icon,
  triggerClassName,
  contentClassName,
  align = "start",
}) {
  const [open, setOpen] = useState(false);
  const isSearchable = searchable ?? options.length > 8;

  const groups = useMemo(() => {
    const map = new Map();
    for (const option of options) {
      const key = option.group ?? "__default";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(option);
    }
    return [...map.entries()];
  }, [options]);

  const selected = useMemo(() => options.find((o) => o.value === value), [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(DEFAULT_TRIGGER_CLASSES, triggerClassName)}
        >
          <span className="flex min-w-0 items-center gap-2">
            {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-400" />}
            <span className={cn("truncate", !selected && "text-slate-400")}>
              {selected ? selected.label : placeholder}
            </span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        className={cn("w-[var(--radix-popover-trigger-width)] min-w-[10rem] p-0", contentClassName)}
      >
        <Command filter={substringFilter}>
          {isSearchable && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {groups.map(([groupName, groupOptions]) => (
              <CommandGroup key={groupName} heading={groupName === "__default" ? undefined : groupName}>
                {groupOptions.map((option) => {
                  // `id` lets an option appear more than once (e.g. a "Suggested"
                  // shortcut duplicating an entry further down the list) without
                  // colliding on cmdk's internal per-item value tracking.
                  const itemKey = option.id ?? String(option.value);
                  return (
                    <CommandItem
                      key={itemKey}
                      value={itemKey}
                      keywords={option.keywords ?? [String(option.label)]}
                      disabled={option.disabled}
                      onSelect={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn("h-4 w-4 shrink-0", value === option.value ? "opacity-100" : "opacity-0")}
                      />
                      <span className="flex-1 truncate text-left">{option.label}</span>
                      {option.suffix}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
