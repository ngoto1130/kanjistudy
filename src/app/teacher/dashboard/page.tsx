import { TeacherNav } from "@/components/ui/teacher-nav"
import { TeacherMobileNav } from "@/components/ui/teacher-mobile-nav"

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />
      <TeacherMobileNav />

      <main className="container mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, Teacher</h1>
            <p className="text-muted-foreground mt-2">
              Manage your students, assignments, and educational content from here.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold text-lg mb-2">Quick Stats</h3>
              <p className="text-sm text-muted-foreground">
                Dashboard statistics coming soon
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold text-lg mb-2">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">
                Activity feed coming soon
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold text-lg mb-2">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Notifications coming soon
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
