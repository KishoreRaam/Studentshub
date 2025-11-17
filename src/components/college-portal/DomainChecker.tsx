import { useState, useEffect } from 'react';
import { Check, X, Loader2, AlertCircle } from 'lucide-react';
import { validateDomainFormat, isDomainReserved } from '../../lib/validations/collegeRegistration';

interface DomainCheckerProps {
  domain: string;
  onValidationChange?: (isValid: boolean) => void;
}

/**
 * Real-time domain availability checker with debouncing
 * Shows visual feedback for domain validation and availability
 */
export function DomainChecker({ domain, onValidationChange }: DomainCheckerProps) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'reserved'>('idle');
  const [message, setMessage] = useState<string>('');
  const [suggestion, setSuggestion] = useState<string>('');

  useEffect(() => {
    if (!domain || domain.length < 3) {
      setStatus('idle');
      setMessage('');
      setSuggestion('');
      onValidationChange?.(false);
      return;
    }

    // Validate format first
    const formatValidation = validateDomainFormat(domain);
    if (!formatValidation.valid) {
      setStatus('invalid');
      setMessage(formatValidation.error || 'Invalid domain format');
      setSuggestion('');
      onValidationChange?.(false);
      return;
    }

    // Check if domain is reserved
    if (isDomainReserved(domain)) {
      setStatus('reserved');
      setMessage('This domain name is reserved and cannot be used');
      setSuggestion(`Try: ${domain}-college, ${domain}-university, or ${domain}-edu`);
      onValidationChange?.(false);
      return;
    }

    // Debounce the availability check
    const timeoutId = setTimeout(() => {
      checkDomainAvailability(domain);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [domain]);

  /**
   * Mock domain availability check
   * In production, this would call an actual API endpoint
   */
  const checkDomainAvailability = async (domainToCheck: string) => {
    setStatus('checking');
    setMessage('Checking availability...');
    setSuggestion('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock logic: domains with common words are "taken"
      const commonWords = ['college', 'university', 'institute', 'school', 'academy'];
      const isTaken = commonWords.some((word) => domainToCheck.toLowerCase().includes(word));

      if (isTaken) {
        setStatus('taken');
        setMessage('This domain is already taken');
        setSuggestion(`Try: ${domainToCheck}-edu, ${domainToCheck}2024, or new-${domainToCheck}`);
        onValidationChange?.(false);
      } else {
        setStatus('available');
        setMessage('This domain is available!');
        setSuggestion('');
        onValidationChange?.(true);
      }
    } catch (error) {
      setStatus('invalid');
      setMessage('Failed to check domain availability');
      setSuggestion('');
      onValidationChange?.(false);
    }
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {/* Status Message */}
      <div className="flex items-start space-x-2">
        {status === 'checking' && (
          <>
            <Loader2 className="w-4 h-4 mt-0.5 text-blue-500 animate-spin flex-shrink-0" />
            <span className="text-sm text-blue-600 dark:text-blue-400">{message}</span>
          </>
        )}

        {status === 'available' && (
          <>
            <Check className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">{message}</span>
          </>
        )}

        {(status === 'taken' || status === 'reserved') && (
          <>
            <X className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-600 dark:text-red-400">{message}</span>
          </>
        )}

        {status === 'invalid' && (
          <>
            <AlertCircle className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
            <span className="text-sm text-orange-600 dark:text-orange-400">{message}</span>
          </>
        )}
      </div>

      {/* Domain Preview (when valid) */}
      {status === 'available' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-700 dark:text-green-300">
            Your institutional email domain will be:
          </p>
          <p className="text-sm font-mono font-semibold text-green-800 dark:text-green-200 mt-1">
            @{domain}.edu.in
          </p>
        </div>
      )}

      {/* Suggestions (when taken or reserved) */}
      {suggestion && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Suggestions:</p>
          <p className="text-sm text-blue-700 dark:text-blue-300">{suggestion}</p>
        </div>
      )}
    </div>
  );
}
