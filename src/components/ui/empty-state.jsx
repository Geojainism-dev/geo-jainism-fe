import { Loader2 } from "lucide-react";

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border py-16 text-center">
      {Icon && <Icon className="mb-2 h-8 w-8 text-muted-foreground/40" />}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="max-w-xs text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}
