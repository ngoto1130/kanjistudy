/**
 * LoginForm Component
 *
 * Mock login form for teachers. Accepts email only (no password).
 * - Pre-fills email if defaultEmail provided
 * - Validates email format before submission
 * - Shows loading state if isLoading is true
 * - Calls onSubmit with email value on form submission
 *
 * Phase 3.5 - Component Implementation (TDD Green Phase)
 * Note: Client Component (uses React hooks for state management)
 */

'use client';

import { useState, FormEvent } from 'react';
import type { LoginFormProps } from '@/types/teacher';
import { Button } from '@/components/ui/button';

export function LoginForm({
  onSubmit,
  defaultEmail = '',
  isLoading = false,
}: LoginFormProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validate email is not empty
    if (!email.trim()) {
      setError('メールアドレスを入力してください');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setError('無効なメールアドレスです');
      return;
    }

    // Call onSubmit callback
    if (onSubmit) {
      onSubmit(email);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md" noValidate>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          autoComplete="email"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="teacher@example.com"
          aria-label="Email"
        />
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Loading...' : 'Login'}
      </Button>
    </form>
  );
}
