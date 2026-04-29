import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEWING", label: "Interviewing" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const activeStatus = params.status || "all";

  // Fetch ALL applications for stats (always show full counts)
  const allApplications = await prisma.application.findMany({
    orderBy: { dateApplied: "desc" },
  });

  // Calculate stats from all applications
  const total = allApplications.length;
  const applied = allApplications.filter((a) => a.status === "APPLIED").length;
  const interviewing = allApplications.filter((a) => a.status === "INTERVIEWING").length;
  const offers = allApplications.filter((a) => a.status === "OFFER").length;

  // Filter the visible list based on activeStatus
  const visibleApplications =
    activeStatus === "all"
      ? allApplications
      : allApplications.filter((a) => a.status === activeStatus);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Job Application Tracker
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your job applications in one place
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/applications/new">
              <Button>Add Application</Button>
            </Link>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{applied}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Interviewing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{interviewing}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{offers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications Section */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filter Tabs */}
            <Tabs value={activeStatus} className="mb-6">
              <TabsList>
                {STATUS_FILTERS.map((filter) => (
                  <Link
                    key={filter.value}
                    href={
                      filter.value === "all"
                        ? "/"
                        : `/?status=${filter.value}`
                    }
                  >
                    <TabsTrigger value={filter.value}>
                      {filter.label}
                    </TabsTrigger>
                  </Link>
                ))}
              </TabsList>
            </Tabs>

            {/* List */}
            {visibleApplications.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No applications match this filter.
              </p>
            ) : (
              <div className="space-y-3">
                {visibleApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{app.company}</p>
                      <p className="text-sm text-muted-foreground">{app.role}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {app.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}