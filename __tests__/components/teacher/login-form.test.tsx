/**
 * Contract Test: LoginForm Component
 *
 * This test verifies the LoginForm component contract:
 * - Renders email input
 * - Calls onSubmit with email
 * - Pre-fills defaultEmail
 * - Shows loading state
 * - Validates email format
 *
 * TDD Phase: RED - These tests MUST FAIL (component not implemented yet)
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/teacher/login-form';

describe('LoginForm Component Contract', () => {
  describe('Form Rendering', () => {
    it('renders email input field', () => {
      render(<LoginForm />);

      const emailInput = screen.getByRole('textbox', { name: /email|メール/i });
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('renders submit button', () => {
      render(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /login|ログイン|submit/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe('Email Input', () => {
    it('accepts user email input', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByRole('textbox', { name: /email|メール/i });
      await user.type(emailInput, 'teacher@example.com');

      expect(emailInput).toHaveValue('teacher@example.com');
    });

    it('pre-fills email when defaultEmail is provided', () => {
      render(<LoginForm defaultEmail="default@example.com" />);

      const emailInput = screen.getByRole('textbox', { name: /email|メール/i });
      expect(emailInput).toHaveValue('default@example.com');
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with email when form is submitted', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();

      render(<LoginForm onSubmit={onSubmit} />);

      const emailInput = screen.getByRole('textbox', { name: /email|メール/i });
      const submitButton = screen.getByRole('button', { name: /login|ログイン|submit/i });

      await user.type(emailInput, 'teacher@kanjistudy.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith('teacher@kanjistudy.com');
      });
    });

    it('does not crash when onSubmit is not provided', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByRole('textbox', { name: /email|メール/i });
      const submitButton = screen.getByRole('button', { name: /login|ログイン|submit/i });

      await user.type(emailInput, 'teacher@example.com');
      await user.click(submitButton);

      // Should not crash
      expect(emailInput).toBeInTheDocument();
    });

    it('prevents submission with empty email', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();

      render(<LoginForm onSubmit={onSubmit} />);

      const submitButton = screen.getByRole('button', { name: /login|ログイン|submit/i });
      await user.click(submitButton);

      // Should not call onSubmit with empty email
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Email Validation', () => {
    it('validates email format before submission', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();

      render(<LoginForm onSubmit={onSubmit} />);

      const emailInput = screen.getByRole('textbox', { name: /email|メール/i });
      const submitButton = screen.getByRole('button', { name: /login|ログイン|submit/i });

      // Enter invalid email
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);

      // Should not submit invalid email
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('accepts valid email format', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();

      render(<LoginForm onSubmit={onSubmit} />);

      const emailInput = screen.getByRole('textbox', { name: /email|メール/i });
      const submitButton = screen.getByRole('button', { name: /login|ログイン|submit/i });

      // Enter valid email
      await user.type(emailInput, 'teacher@kanjistudy.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });
    });

    it('shows error message for invalid email', async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByRole('textbox', { name: /email|メール/i });
      const submitButton = screen.getByRole('button', { name: /login|ログイン|submit/i });

      // Enter invalid email and submit
      await user.type(emailInput, 'not-an-email');
      await user.click(submitButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/invalid.*email|無効なメール/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('shows loading state when isLoading is true', () => {
      render(<LoginForm isLoading={true} />);

      const submitButton = screen.getByRole('button', { name: /login|ログイン|loading|読み込み中/i });
      expect(submitButton).toBeDisabled();
    });

    it('disables submit button when loading', () => {
      render(<LoginForm isLoading={true} />);

      const submitButton = screen.getByRole('button', { name: /login|ログイン|loading|読み込み中/i });
      expect(submitButton).toHaveAttribute('disabled');
    });

    it('enables submit button when not loading', () => {
      render(<LoginForm isLoading={false} />);

      const submitButton = screen.getByRole('button', { name: /login|ログイン|submit/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Form Attributes', () => {
    it('has proper form element', () => {
      const { container } = render(<LoginForm />);

      const form = container.querySelector('form');
      expect(form).toBeTruthy();
    });

    it('email input has autocomplete attribute', () => {
      render(<LoginForm />);

      const emailInput = screen.getByRole('textbox', { name: /email|メール/i });
      expect(emailInput).toHaveAttribute('autocomplete', 'email');
    });
  });

  describe('Accessibility', () => {
    it('email input has proper label', () => {
      render(<LoginForm />);

      const emailInput = screen.getByRole('textbox', { name: /email|メール/i });
      const label = screen.getByLabelText(/email|メール/i);

      expect(label).toBe(emailInput);
    });

    it('submit button has proper type', () => {
      render(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /login|ログイン|submit/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
});
