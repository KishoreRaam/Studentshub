import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../services/profile.service';
import { WelcomeStep } from './WelcomeStep';
import { DepartmentStep } from './DepartmentStep';
import { SpecializationStep } from './SpecializationStep';
import { SummaryStep } from './SummaryStep';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'edubuzz_onboarding';

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClose = () => {
    setStep(0);
    setSelectedDepartment(null);
    setSelectedSpecialization(null);
    onClose();
  };

  const handleDepartmentSelect = (deptId: string) => {
    setSelectedDepartment(deptId);
    setSelectedSpecialization(null);
    setStep(2);
  };

  const handleSpecializationSelect = (specId: string) => {
    setSelectedSpecialization(specId);
    setStep(3);
  };

  const handleContinue = async () => {
    if (!selectedDepartment || !selectedSpecialization) return;

    const selection = {
      department: selectedDepartment,
      specialization: selectedSpecialization,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));

    if (user) {
      try {
        await updateUserProfile(user.$id, {
          stream: `${selectedDepartment}__${selectedSpecialization}`,
        });
      } catch (err) {
        console.error('Failed to save onboarding to profile:', err);
      }
    }

    handleClose();
    navigate('/dashboard');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-[3px]"
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #3b82f6, #06b6d4)',
              }}
            >
              {/* Inner container with light background */}
              <div className="relative bg-gray-50 dark:bg-gray-800 rounded-[14px] min-h-0">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-5 right-5 z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Steps */}
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <WelcomeStep
                      key="welcome"
                      onGetStarted={() => setStep(1)}
                      onSkip={handleClose}
                    />
                  )}
                  {step === 1 && (
                    <DepartmentStep
                      key="department"
                      onSelect={handleDepartmentSelect}
                      onBack={() => setStep(0)}
                      selectedDepartment={selectedDepartment}
                    />
                  )}
                  {step === 2 && selectedDepartment && (
                    <SpecializationStep
                      key="specialization"
                      departmentId={selectedDepartment}
                      onSelect={handleSpecializationSelect}
                      onBack={() => setStep(1)}
                      selectedSpecialization={selectedSpecialization}
                    />
                  )}
                  {step === 3 && selectedDepartment && selectedSpecialization && (
                    <SummaryStep
                      key="summary"
                      departmentId={selectedDepartment}
                      specializationId={selectedSpecialization}
                      onContinue={handleContinue}
                      onEditDepartment={() => setStep(1)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
