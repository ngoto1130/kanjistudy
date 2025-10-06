import { TeacherNav } from "@/components/ui/teacher-nav"
import { TeacherMobileNav } from "@/components/ui/teacher-mobile-nav"

interface ReportPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <TeacherNav />
      <TeacherMobileNav />

      <main className="container mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Report {id}</h1>
            <p className="text-muted-foreground mt-2">
              View and manage report {id}
            </p>
          </div>

          <div className="rounded-lg border bg-card p-8">
            <p className="text-muted-foreground text-center">
              Report {id} content - Coming soon
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
