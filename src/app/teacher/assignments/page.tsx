import { TeacherNav } from "@/components/ui/teacher-nav"
import { TeacherMobileNav } from "@/components/ui/teacher-mobile-nav"

export default function AssignmentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />
      <TeacherMobileNav />

      <main className="container mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage kanji assignments for students
            </p>
          </div>

          <div className="rounded-lg border bg-card p-8">
            <p className="text-muted-foreground text-center">
              Assignment creation interface - Coming soon
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
