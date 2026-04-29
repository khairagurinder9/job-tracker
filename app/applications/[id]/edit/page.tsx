import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateApplication } from "./actions";
import Link from "next/link";

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch the application
  const application = await prisma.application.findUnique({
    where: { id },
  });

  // If not found, show 404
  if (!application) {
    notFound();
  }

  // Bind the id to the action so it knows which record to update
  const updateActionWithId = updateApplication.bind(null, id);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mt-4">
            Edit Application
          </h1>
          <p className="text-muted-foreground mt-1">
            Update your application details
          </p>
        </div>

        <form action={updateActionWithId} className="space-y-6">
          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              name="company"
              defaultValue={application.company}
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              name="role"
              defaultValue={application.role}
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={application.status}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPLIED">Applied</SelectItem>
                <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
                <SelectItem value="OFFER">Offer</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Link */}
          <div className="space-y-2">
            <Label htmlFor="link">Job Posting URL</Label>
            <Input
              id="link"
              name="link"
              type="url"
              defaultValue={application.link || ""}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={application.notes || ""}
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="submit">Save Changes</Button>
            <Link href="/">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}