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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-base font-semibold text-gray-900 dark:text-white">
          {label}
          {required && <span className="text-red-500 ml-1.5">*</span>}
        </Label>
        {showSuccess && !error && (
          <Check className="w-4 h-4 text-green-500" aria-label="Valid input" />
        )}
      </div>

      {children}

      {/* Help Text */}
      {helpText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{helpText}</p>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start space-x-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}
