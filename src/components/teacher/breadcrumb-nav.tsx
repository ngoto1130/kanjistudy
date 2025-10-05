/**
 * BreadcrumbNav Component
 *
 * Displays breadcrumb navigation trail (Dashboard > Current Page).
 * - All items except current are clickable links
 * - Current item is plain text with aria-current="page"
 * - Compact on mobile (responsive classes)
 *
 * Phase 3.5 - Component Implementation (TDD Green Phase)
 * Note: Client Component (uses Next.js hooks if needed)
 */

'use client';

import Link from 'next/link';
import type { BreadcrumbNavProps } from '@/types/teacher';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  // Empty state
  if (items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = item.isCurrent || isLast;

          return (
            <div key={item.href} className="flex items-center">
              <BreadcrumbItem>
                {isCurrent ? (
                  <BreadcrumbPage aria-current="page">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
