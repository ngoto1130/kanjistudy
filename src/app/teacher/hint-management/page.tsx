import { TeacherNav } from "@/components/ui/teacher-nav"
import { TeacherMobileNav } from "@/components/ui/teacher-mobile-nav"

export default function HintManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />
      <TeacherMobileNav />

      <main className="container mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hint Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage hints and study aids
            </p>
          </div>

          <div className="rounded-lg border bg-card p-8">
            <p className="text-muted-foreground text-center">
              Hint management interface - Coming soon
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
