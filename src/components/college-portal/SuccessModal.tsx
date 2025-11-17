import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '../ui/button';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  institutionName: string;
  officialEmail: string;
  phoneNumber: string;
}

/**
 * Success modal shown after form submission
 */
export function SuccessModal({
  isOpen,
  onClose,
  institutionName,
  officialEmail,
  phoneNumber,
}: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                </motion.div>

                {/* Success Message */}
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
                  Registration Successful!
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                  Thank you for registering <span className="font-semibold">{institutionName}</span>.
                  Our team will review your application shortly.
                </p>

                {/* Next Steps */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    What Happens Next?
                  </h3>
                  <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold mr-3 flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        Our team will verify your institution details within <strong>24 hours</strong>
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold mr-3 flex-shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        You'll receive a verification email with required documents list
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold mr-3 flex-shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        After document submission, setup will be completed in <strong>48 hours</strong>
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-semibold mr-3 flex-shrink-0 mt-0.5">
                        4
                      </span>
                      <span>
                        You'll receive admin credentials and onboarding support
                      </span>
                    </li>
                  </ol>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    We'll contact you at:
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="break-all">{officialEmail}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{phoneNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Support Info */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Need immediate assistance?{' '}
                  <a
                    href="mailto:support@studentperks.in"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Contact our support team
                  </a>
                </div>

                {/* Action Button */}
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white h-12"
                >
                  Got it, Thanks!
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
