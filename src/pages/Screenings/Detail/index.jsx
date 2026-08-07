import { Link, useParams } from "react-router-dom";
import { Navbar, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { usePublicScreening } from "@/features/publicScreenings/hooks";

export default function ScreeningDetailPage() {
  const { id } = useParams();
  const { data: screening, isLoading, isError } = usePublicScreening(id);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-24">
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {isError && <p className="text-sm text-destructive">Event not found.</p>}
        {screening && (
          <>
            {screening.image && (
              <img
                src={screening.image}
                alt={screening.title}
                className="mb-6 h-64 w-full rounded-2xl border border-border object-cover"
              />
            )}
            <h1 className="text-3xl font-semibold">{screening.title}</h1>
            {screening.description && <p className="mt-4 text-muted-foreground">{screening.description}</p>}
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-medium">Date &amp; time</dt>
                <dd className="text-muted-foreground">
                  {screening.localDate}, {screening.localTime}
                </dd>
              </div>
              <div>
                <dt className="font-medium">Venue</dt>
                <dd className="text-muted-foreground">
                  {screening.venue}
                  {screening.venueAddress ? `, ${screening.venueAddress}` : ""}
                  {screening.city ? `, ${screening.city}` : ""}
                  {screening.country ? `, ${screening.country}` : ""}
                </dd>
              </div>
              {screening.capacity && (
                <div>
                  <dt className="font-medium">Capacity</dt>
                  <dd className="text-muted-foreground">{screening.capacity}</dd>
                </div>
              )}
            </dl>
            <Button asChild className="mt-8">
              <Link to={`/register?screeningId=${screening.id}`}>Register for this event</Link>
            </Button>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
