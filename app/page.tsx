import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEWING", label: "Interviewing" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
];

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "APPLIED":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "INTERVIEWING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
    case "OFFER":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800";
    case "WITHDRAWN":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800";
    default:
      return "";
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const activeStatus = params.status || "all";

  const allApplications = await prisma.application.findMany({
    orderBy: { dateApplied: "desc" },
  });

  const total = allApplications.length;
  const applied = allApplications.filter((a) => a.status === "APPLIED").length;
  const interviewing = allApplications.filter((a) => a.status === "INTERVIEWING").length;
  const offers = allApplications.filter((a) => a.status === "OFFER").length;

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
  <p className="text-xs text-muted-foreground mt-1">
    Applied {formatDistanceToNow(app.dateApplied, { addSuffix: true })}
  </p>
</div>
                    <Badge
                      variant="outline"
                      className={getStatusBadgeClass(app.status)}
                    >
                      {app.status}
                    </Badge>
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