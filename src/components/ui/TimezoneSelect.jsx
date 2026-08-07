import { useMemo } from "react";
import { Clock } from "lucide-react";
import Combobox from "@/components/ui/Combobox";
import { cn } from "@/lib/utils";
import { getTimezoneOffsetMinutes, formatUtcOffset } from "@/lib/timezone";

const ALL_TIMEZONES = Intl.supportedValuesOf("timeZone");
const LOCAL_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Some ICU builds only expose the legacy IANA identifier (e.g. "Asia/Calcutta")
// and not the modern one people actually search for ("Kolkata"). Both refer to
// the same zone; this just makes the modern name searchable and displayed.
const LEGACY_CITY_ALIASES = {
  Calcutta: "Kolkata",
  Katmandu: "Kathmandu",
  Rangoon: "Yangon",
  Saigon: "Ho Chi Minh City",
  Dacca: "Dhaka",
  Thimbu: "Thimphu",
  Ujung_Pandang: "Makassar",
  Asmera: "Asmara",
  Faeroe: "Faroe",
  Ponape: "Pohnpei",
  Truk: "Chuuk",
  Kiev: "Kyiv",
};

function toOption(tz, now) {
  const [region, ...rest] = tz.split("/");
  const rawCity = rest.length ? rest.join("/") : region;
  const alias = LEGACY_CITY_ALIASES[rawCity];
  const city = (alias ?? rawCity).replace(/_/g, " ");
  const offsetMinutes = getTimezoneOffsetMinutes(tz, now);
  const offsetLabel = formatUtcOffset(offsetMinutes);
  return {
    value: tz,
    label: rest.length ? `${region.replace(/_/g, " ")} / ${city}` : city,
    keywords: [tz, city, rawCity.replace(/_/g, " "), region, offsetLabel],
    offsetMinutes,
    suffix: <span className="shrink-0 text-xs font-semibold text-slate-400">{offsetLabel}</span>,
  };
}

function buildTimezoneOptions() {
  const now = new Date();

  const all = ALL_TIMEZONES.map((tz) => ({ ...toOption(tz, now), group: "All timezones" })).sort(
    (a, b) => a.offsetMinutes - b.offsetMinutes || a.value.localeCompare(b.value)
  );

  const suggested = ALL_TIMEZONES.includes(LOCAL_TIMEZONE)
    ? [
        {
          ...toOption(LOCAL_TIMEZONE, now),
          id: `suggested:${LOCAL_TIMEZONE}`,
          label: `Your timezone — ${toOption(LOCAL_TIMEZONE, now).label}`,
          group: "Suggested",
        },
      ]
    : [];

  return [...suggested, ...all];
}

export default function TimezoneSelect({ id, value, onChange, error, placeholder = "Select timezone..." }) {
  const options = useMemo(buildTimezoneOptions, []);

  return (
    <Combobox
      id={id}
      icon={Clock}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      searchPlaceholder="Search city, region, or UTC offset..."
      emptyText="No timezone found."
      searchable
      triggerClassName={cn(
        "rounded-xl border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-normal hover:bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800",
        error && "border-rose-300 focus:ring-rose-500/20"
      )}
    />
  );
}
