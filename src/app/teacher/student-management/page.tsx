import { TeacherNav } from "@/components/ui/teacher-nav"
import { TeacherMobileNav } from "@/components/ui/teacher-mobile-nav"

export default function StudentManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />
      <TeacherMobileNav />

      <main className="container mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage student accounts and progress
            </p>
          </div>

          <div className="rounded-lg border bg-card p-8">
            <p className="text-muted-foreground text-center">
              Student management interface - Coming soon
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
