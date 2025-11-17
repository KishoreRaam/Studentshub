import { ReactNode } from 'react';
import { Label } from '../ui/label';
import { Check, AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  children: ReactNode;
  showSuccess?: boolean;
}

/**
 * Reusable form field wrapper with label, error messages, and success indicators
 */
export function FormField({
  label,
  name,
  error,
  required = false,
  helpText,
  children,
  showSuccess = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {showSuccess && !error && (
          <Check className="w-4 h-4 text-green-500" aria-label="Valid input" />
        )}
      </div>

      {children}

      {/* Error Message */}
      {error && (
        <div className="flex items-start space-x-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
    </div>
  );
}
