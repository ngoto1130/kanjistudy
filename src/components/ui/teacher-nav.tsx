"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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

export function TeacherNav() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
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

  return (
    <nav className="hidden md:flex items-center justify-between w-full border-b p-4 bg-background">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {MENU_ITEMS.sort((a, b) => a.order - b.order).map((item) => (
            <NavigationMenuItem key={item.id}>
              {item.children ? (
                <>
                  <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-48 gap-1 p-2">
                      {item.children.sort((a, b) => (a.order || 0) - (b.order || 0)).map((child) => (
                        <li key={child.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={child.href || '#'}
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              )}
                            >
                              <div className="text-sm font-medium leading-none">
                                {child.label}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href={item.href || '#'}>
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <Button
        onClick={handleLogout}
        disabled={isLoggingOut}
        variant="outline"
        className="ml-4"
      >
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </Button>
    </nav>
  )
}
