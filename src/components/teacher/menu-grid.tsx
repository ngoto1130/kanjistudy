/**
 * MenuGrid Component
 *
 * Displays teacher menu items in a responsive grid layout:
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: 3 columns
 *
 * Phase 3.5 - Component Implementation (TDD Green Phase)
 */

import Link from 'next/link';
import type { MenuGridProps } from '@/types/teacher';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function MenuGrid({ items, columns }: MenuGridProps) {
  const cols = columns || { mobile: 1, tablet: 2, desktop: 3 };

  // Empty state
  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="w-full">
      <div
        className={`grid gap-4 grid-cols-${cols.mobile} sm:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop}`}
        style={{
          // Fallback for dynamic Tailwind classes
          gridTemplateColumns: `repeat(${cols.mobile}, minmax(0, 1fr))`,
        }}
      >
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="block min-h-[44px]">
            <Card className="h-full transition-colors hover:bg-accent hover:border-primary cursor-pointer">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @media (min-width: 640px) {
          div {
            grid-template-columns: repeat(${cols.tablet}, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          div {
            grid-template-columns: repeat(${cols.desktop}, minmax(0, 1fr));
          }
        }
      `}</style>
    </nav>
  );
}
