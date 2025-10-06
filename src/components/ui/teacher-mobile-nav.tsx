"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import type { MenuItem } from "@/types/auth"

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'assignments',
    label: 'Assignments',
    href: '/teacher/assignments',
    order: 1
  },
  {
    id: 'problem-management',
    label: 'Problem Management',
    order: 2,
    children: [
      { id: 'problems', label: 'Problem Management', href: '/teacher/problem-management', order: 1 },
      { id: 'hints', label: 'Hint Management', href: '/teacher/hint-management', order: 2 }
    ]
  },
  {
    id: 'user-management',
    label: 'User Management',
    order: 3,
    children: [
      { id: 'students', label: 'Student Management', href: '/teacher/student-management', order: 1 },
      { id: 'parents', label: 'Parent Management', href: '/teacher/parent-management', order: 2 }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    order: 4,
    children: [
      { id: 'report-1', label: 'Report 1', href: '/teacher/reports/1', order: 1 },
      { id: 'report-2', label: 'Report 2', href: '/teacher/reports/2', order: 2 },
      { id: 'report-3', label: 'Report 3', href: '/teacher/reports/3', order: 3 }
    ]
  },
  {
    id: 'admin',
    label: 'Administrative Functions',
    href: '/teacher/admin',
    order: 5
  }
]

export function TeacherMobileNav() {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        setIsOpen(false)
        router.push('/login')
      } else {
        console.error('Logout failed')
        setIsLoggingOut(false)
      }
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const handleNavigation = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <nav className="flex md:hidden items-center justify-between w-full border-b p-4 bg-background">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Teacher Navigation</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-6">
            {MENU_ITEMS.sort((a, b) => a.order - b.order).map((item) => (
              <div key={item.id} className="flex flex-col gap-2">
                {item.children ? (
                  <>
                    <div className="font-semibold text-sm text-muted-foreground px-2">
                      {item.label}
                    </div>
                    <div className="flex flex-col gap-1 pl-4">
                      {item.children.sort((a, b) => (a.order || 0) - (b.order || 0)).map((child) => (
                        <Button
                          key={child.id}
                          variant="ghost"
                          className="justify-start min-h-[44px]"
                          onClick={() => handleNavigation(child.href || '#')}
                        >
                          {child.label}
                        </Button>
                      ))}
                    </div>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    className="justify-start min-h-[44px] font-medium"
                    onClick={() => handleNavigation(item.href || '#')}
                  >
                    {item.label}
                  </Button>
                )}
              </div>
            ))}

            <div className="border-t pt-4 mt-4">
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="outline"
                className="w-full min-h-[44px]"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="text-sm font-semibold">Teacher Dashboard</div>
    </nav>
  )
}
