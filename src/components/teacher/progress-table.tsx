/**
 * ProgressTable Component
 *
 * Displays student progress data in a responsive layout:
 * - Desktop (md+): Full table with columns
 * - Mobile (<md): Card layout with labeled fields
 *
 * Phase 3.5 - Component Implementation (TDD Green Phase)
 */

'use client';

import { useState, useEffect } from 'react';
import type { ProgressTableProps } from '@/types/teacher';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ProgressTable({
  students,
  filter,
  onFilterChange,
  emptyMessage = '学習データがありません',
}: ProgressTableProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const handleFilterClick = (period: 'last-week' | 'last-month' | 'custom') => {
    if (onFilterChange) {
      onFilterChange({ period });
    }
  };

  // Empty state
  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter.period === 'last-week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterClick('last-week')}
        >
          先週
        </Button>
        <Button
          variant={filter.period === 'last-month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterClick('last-month')}
        >
          先月
        </Button>
        <Button
          variant={filter.period === 'custom' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterClick('custom')}
        >
          カスタム
        </Button>
      </div>

      {/* Desktop table view */}
      {!isMobile && (
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名前</TableHead>
                <TableHead>学習回数</TableHead>
                <TableHead>クリア数</TableHead>
                <TableHead>正答率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(({ student, metrics }) => (
                <TableRow key={student.id} data-testid="student-row">
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{metrics.studySessions}</TableCell>
                  <TableCell>{metrics.clearedQuestions}</TableCell>
                  <TableCell>{metrics.accuracyRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Mobile card view */}
      {isMobile && (
        <div className="md:hidden space-y-4">
          {students.map(({ student, metrics }) => (
            <Card key={student.id} className="border" data-testid="student-card">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">名前:</span>
                  <span>{student.name}</span>
                  <span className="font-semibold">学習回数:</span>
                  <span>{metrics.studySessions}</span>
                  <span className="font-semibold">クリア数:</span>
                  <span>{metrics.clearedQuestions}</span>
                  <span className="font-semibold">正答率:</span>
                  <span>{metrics.accuracyRate}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
