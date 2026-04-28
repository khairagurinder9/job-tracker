import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch all applications from the database
  const applications = await prisma.application.findMany({
    orderBy: { dateApplied: "desc" },
  });

  // Calculate stats
  const total = applications.length;
  const applied = applications.filter((a) => a.status === "APPLIED").length;
  const interviewing = applications.filter((a) => a.status === "INTERVIEWING").length;
  const offers = applications.filter((a) => a.status === "OFFER").length;

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
            <Button>Add Application</Button>
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
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No applications yet. Click &ldquo;Add Application&rdquo; to get started.
              </p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
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