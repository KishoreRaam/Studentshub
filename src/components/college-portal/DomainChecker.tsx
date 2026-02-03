import { useState, useEffect } from 'react';
import { Check, X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateDomainFormat, isDomainReserved } from '../../lib/validations/collegeRegistration';

interface DomainCheckerProps {
  domain: string;
  extension?: string;
  onValidationChange?: (isValid: boolean) => void;
  triggerCheck?: boolean;
  onCheckComplete?: (status: 'available' | 'taken') => void;
}

/**
 * Real-time domain availability checker with manual trigger
 * Shows professional animations for available/unavailable states
 */
export function DomainChecker({ domain, extension = '.edu.in', onValidationChange, triggerCheck, onCheckComplete }: DomainCheckerProps) {
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'reserved'>('idle');
  const [message, setMessage] = useState<string>('');
  const [suggestion, setSuggestion] = useState<string>('');
  const [showGlow, setShowGlow] = useState(false);

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

    // Reset status when domain changes
    if (status !== 'idle') {
      setStatus('idle');
      setMessage('');
      setSuggestion('');
    }
  }, [domain]);

  // Trigger manual check when button is clicked
  useEffect(() => {
    if (triggerCheck && status === 'idle') {
      checkDomainAvailability(domain);
    }
  }, [triggerCheck]);

  /**
   * DNS-based domain availability check via API
   */
  const checkDomainAvailability = async (domainToCheck: string) => {
    setStatus('checking');
    setMessage('Checking availability...');
    setSuggestion('');
    setShowGlow(false);

    try {
      const response = await fetch('/api/check-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          domain: domainToCheck,
          extension: extension 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check domain');
      }

      const data = await response.json();

      if (data.available) {
        setStatus('available');
        setMessage('Domain appears available');
        setSuggestion('');
        setShowGlow(true);
        onValidationChange?.(true);
        onCheckComplete?.('available');
        
        // Remove glow after 1.2s
        setTimeout(() => setShowGlow(false), 1200);
      } else {
        setStatus('taken');
        setMessage('Domain already in use');
        setSuggestion(`Try: ${domainToCheck}-edu, ${domainToCheck}2024, or new-${domainToCheck}`);
        setShowGlow(true);
        onValidationChange?.(false);
        onCheckComplete?.('taken');
        
        // Remove glow after 1.2s
        setTimeout(() => setShowGlow(false), 1200);
      }
    } catch (error) {
      setStatus('invalid');
      setMessage('Failed to check domain availability');
      setSuggestion('');
      onValidationChange?.(false);
      onCheckComplete?.('taken');
    }
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mt-2 space-y-2"
      >
        {/* Status Message */}
        <motion.div
          className={`flex items-start space-x-2 ${
            status === 'taken' ? 'animate-shake' : ''
          }`}
          initial={status === 'available' ? { scale: 0.8, rotate: -10 } : { scale: 1 }}
          animate={status === 'available' ? { scale: 1, rotate: 0 } : { scale: 1 }}
          transition={{
            type: status === 'available' ? 'spring' : 'tween',
            stiffness: status === 'available' ? 300 : 100,
            damping: status === 'available' ? 20 : 10,
          }}
        >
          {status === 'checking' && (
            <>
              <Loader2 className="w-4 h-4 mt-0.5 text-blue-500 animate-spin flex-shrink-0" />
              <span className="text-sm text-blue-600 dark:text-blue-400">{message}</span>
            </>
          )}

          {status === 'available' && (
            <>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Check className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
              </motion.div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">{message}</span>
            </>
          )}

          {(status === 'taken' || status === 'reserved') && (
            <>
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <X className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
              </motion.div>
              <span className="text-sm text-red-600 dark:text-red-400">{message}</span>
            </>
          )}

          {status === 'invalid' && (
            <>
              <AlertCircle className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
              <span className="text-sm text-orange-600 dark:text-orange-400">{message}</span>
            </>
          )}
        </motion.div>

        {/* Domain Preview with Input Glow (when valid) */}
        {status === 'available' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3"
          >
            <p className="text-sm text-green-700 dark:text-green-300">
              Your institutional email domain will be:
            </p>
            <p className="text-sm font-mono font-semibold text-green-800 dark:text-green-200 mt-1">
              @{domain}{extension}
            </p>
          </motion.div>
        )}

        {/* Suggestions (when taken or reserved) */}
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
          >
            <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Suggestions:</p>
            <p className="text-sm text-red-700 dark:text-red-300">{suggestion}</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
