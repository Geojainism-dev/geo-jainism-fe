import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Footer } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePublicScreenings } from "@/features/publicScreenings/hooks";

export default function ScreeningsListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePublicScreenings({ page, limit: 10 });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-24">
        <h1 className="text-3xl font-semibold">Upcoming Events</h1>
        <p className="mt-2 text-muted-foreground">Tamil Jains Documentary screenings and events near you.</p>

        <div className="mt-8 space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {isError && <p className="text-sm text-destructive">Failed to load events.</p>}
          {data && data.screenings.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No upcoming events right now — check back soon.
            </p>
          )}
          {data?.screenings.map((screening) => (
            <Card key={screening.id}>
              <CardHeader>
                <CardTitle>{screening.title}</CardTitle>
                <CardDescription>
                  {screening.localDate}, {screening.localTime} · {screening.venue}
                  {screening.city ? `, ${screening.city}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to={`/events/${screening.id}`}>View details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {data && data.pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
