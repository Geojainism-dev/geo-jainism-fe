import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPending() {
  return (
    <div className="admin-shell flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <img src="/logo.png" alt="GEO Jainism" className="h-16 w-16 rounded-full object-cover" />
          <p className="text-lg font-semibold tracking-tight text-foreground">
            GEO <span className="text-primary">Jainism</span>
          </p>
        </div>
        <Card className="border-border/80 text-center shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Waiting for Approval</CardTitle>
            <CardDescription>
              Your account has been registered. A Super Admin needs to approve your access
              before you can use the admin panel — check back soon.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
