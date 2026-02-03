import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Save, Send, X, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { FormField } from './FormField';
import { DomainChecker } from './DomainChecker';
import { SuccessModal } from './SuccessModal';
import { useFormAutoSave, loadFormDraft, hasDraft, formatSavedDate } from '../../hooks/useFormAutoSave';
import { collegeRegistrationSchema, CollegeRegistrationFormData } from '../../lib/validations/collegeRegistration';
import {
  INSTITUTION_TYPES,
  STATES,
  DISTRICTS_BY_STATE,
  CURRENT_EMAIL_SYSTEMS,
  TIMELINE_OPTIONS,
} from '../../types/collegePortal';
import { databases, databaseId, COLLECTIONS, AppwriteID } from '../../lib/appwrite';

const STORAGE_KEY = 'college-registration-draft';

/**
 * Main College Registration Form Component
 * Features: Real-time validation, auto-save, domain checker, conditional fields
 */
export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const [triggerDomainCheck, setTriggerDomainCheck] = useState(false);
  const [domainCheckStatus, setDomainCheckStatus] = useState<'idle' | 'available' | 'taken'>('idle');
  const [inputGlowClass, setInputGlowClass] = useState<string>('');
  const [domainExtension, setDomainExtension] = useState<string>('.edu.in');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<CollegeRegistrationFormData>({
    resolver: zodResolver(collegeRegistrationSchema),
    defaultValues: {
      institutionName: '',
      institutionType: '',
      state: '',
      district: '',
      studentStrength: undefined,
      departments: undefined,
      principalName: '',
      officialEmail: '',
      phoneNumber: '',
      preferredDomain: '',
      timeline: undefined,
      currentEmailSystem: '',
      comments: '',
    },
  });

  // Auto-save functionality
  const { clearDraft } = useFormAutoSave({
    watch,
    storageKey: STORAGE_KEY,
    debounceMs: 2000,
  });

  // Watch fields for conditional rendering and validation
  const selectedState = watch('state');
  const preferredDomain = watch('preferredDomain');
  const formData = watch();

  // Debug: Log when preferredDomain changes
  console.log('Preferred Domain:', preferredDomain);

  // Reset domain check status when extension changes
  useEffect(() => {
    if (domainCheckStatus !== 'idle') {
      setDomainCheckStatus('idle');
      setInputGlowClass('');
    }
  }, [domainExtension]);

  // Load draft on mount
  useEffect(() => {
    if (hasDraft(STORAGE_KEY)) {
      const draft = loadFormDraft<CollegeRegistrationFormData>(STORAGE_KEY);
      if (draft) {
        setShowDraftBanner(true);
        setDraftSavedAt(draft.savedAt);
      }
    }
  }, []);

  // Load draft into form
  const loadDraft = () => {
    const draft = loadFormDraft<CollegeRegistrationFormData>(STORAGE_KEY);
    if (draft?.data) {
      Object.entries(draft.data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          setValue(key as keyof CollegeRegistrationFormData, value as any);
        }
      });
      setShowDraftBanner(false);
    }
  };

  // Dismiss draft banner
  const dismissDraft = () => {
    clearDraft();
    setShowDraftBanner(false);
  };

  // Handle domain check button click
  const handleCheckDomain = () => {
    if (preferredDomain) {
      setTriggerDomainCheck(true);
      setDomainCheckStatus('idle');
      setInputGlowClass('');
    }
  };

  // Handle domain check completion
  const handleDomainCheckComplete = (status: 'available' | 'taken') => {
    setTriggerDomainCheck(false);
    setDomainCheckStatus(status);
    
    // Apply glow effect
    if (status === 'available') {
      setInputGlowClass('input-glow-green');
    } else {
      setInputGlowClass('input-glow-red');
    }
    
    // Remove glow class after animation completes
    setTimeout(() => {
      setInputGlowClass('');
    }, 1200);
  };

  // Handle form submission
  const onSubmit = async (data: CollegeRegistrationFormData) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Submit to Appwrite
      await databases.createDocument(
        databaseId,
        COLLECTIONS.COLLEGE_REGISTRATIONS,
        AppwriteID.unique(),
        {
          ...data,
          status: 'pending',
          submittedAt: new Date().toISOString(),
        }
      );

      // Clear draft and reset form
      clearDraft();
      setShowSuccess(true);

      // Reset form after short delay
      setTimeout(() => {
        reset();
      }, 500);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitError(
        error?.message || 'Failed to submit registration. Please try again or contact support.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Draft Banner */}
      <AnimatePresence>
        {showDraftBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Save className="w-4 h-4 text-blue-600" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-blue-800 dark:text-blue-200">
                  You have a saved draft from {formatSavedDate(draftSavedAt)}.{' '}
                  <button
                    onClick={loadDraft}
                    className="font-semibold underline hover:no-underline"
                  >
                    Resume where you left off
                  </button>
                </span>
                <button
                  onClick={dismissDraft}
                  className="ml-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Error */}
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {submitError}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Institution Details Section */}
        <div className="space-y-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
            Institution Details
          </h3>

          {/* Institution Name */}
          <FormField
            label="College/Institution Name"
            name="institutionName"
            error={errors.institutionName?.message}
            required
            showSuccess={dirtyFields.institutionName && !errors.institutionName}
            helpText="As it appears on government records"
          >
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <Input
                {...register('institutionName')}
                placeholder="Enter your institution's official name"
                disabled={isSubmitting}
                className="h-12 pl-11 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-900"
              />
            </div>
          </FormField>

          {/* Institution Type and State Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Institution Type */}
            <FormField
              label="Institution Type"
              name="institutionType"
              error={errors.institutionType?.message}
              required
            >
              <Select
                onValueChange={(value) => setValue('institutionType', value, { shouldDirty: true })}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {INSTITUTION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            {/* State */}
            <FormField
              label="State"
              name="state"
              error={errors.state?.message}
              required
            >
              <Select
                onValueChange={(value) => {
                  setValue('state', value, { shouldDirty: true });
                  setValue('district', ''); // Reset district when state changes
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {/* Student Strength and Departments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Total Student Strength"
              name="studentStrength"
              error={errors.studentStrength?.message}
              required
              helpText="Total enrolled students across all years"
            >
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <Input
                  {...register('studentStrength', { valueAsNumber: true })}
                  type="number"
                  placeholder="e.g., 2500"
                  disabled={isSubmitting}
                  className="h-12 pl-11 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-900"
                  min="100"
                  max="50000"
                />
              </div>
            </FormField>

            <FormField
              label="Number of Departments/Streams"
              name="departments"
              error={errors.departments?.message}
              required
              helpText="Total academic departments"
            >
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <Input
                  {...register('departments', { valueAsNumber: true })}
                  type="number"
                  placeholder="e.g., 8"
                  disabled={isSubmitting}
                  className="h-12 pl-11 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-900"
                  min="1"
                  max="100"
                />
              </div>
            </FormField>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
            Contact Information
          </h3>

          {/* Principal Name */}
          <FormField
            label="Principal/Dean Name"
            name="principalName"
            error={errors.principalName?.message}
            required
            showSuccess={dirtyFields.principalName && !errors.principalName}
          >
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <Input
                {...register('principalName')}
                placeholder="Full name of institutional head"
                disabled={isSubmitting}
                className="h-12 pl-11 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-900"
              />
            </div>
          </FormField>

          {/* Official Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Official Email Address"
              name="officialEmail"
              error={errors.officialEmail?.message}
              required
              helpText="We'll send verification details here"
              showSuccess={dirtyFields.officialEmail && !errors.officialEmail}
            >
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <Input
                  {...register('officialEmail')}
                  type="email"
                  placeholder="principal@institution.edu.in"
                  disabled={isSubmitting}
                  className="h-12 pl-11 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-900"
                />
              </div>
            </FormField>

            <FormField
              label="Phone Number"
              name="phoneNumber"
              error={errors.phoneNumber?.message}
              required
              helpText="10-digit mobile number"
              showSuccess={dirtyFields.phoneNumber && !errors.phoneNumber}
            >
              <div className="flex gap-2">
                <div className="flex items-center justify-center px-4 h-12 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 font-semibold">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91
                </div>
                <Input
                  {...register('phoneNumber')}
                  type="tel"
                  placeholder="10-digit mobile number"
                  disabled={isSubmitting}
                  className="h-12 flex-1 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-900"
                  maxLength={10}
                />
              </div>
            </FormField>
          </div>

          {/* Preferred Domain */}
          <FormField
            label="Preferred Domain Name"
            name="preferredDomain"
            error={errors.preferredDomain?.message}
            helpText={
              preferredDomain?.trim()
                ? `Your students will get emails like student@${preferredDomain.trim()}${domainExtension}`
                : `Your students will get emails like student@yourcollegename${domainExtension}`
            }
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <Input
                  {...register('preferredDomain')}
                  placeholder="yourcollegename"
                  disabled={isSubmitting}
                  className={`h-12 pl-11 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-900 transition-all ${
                    inputGlowClass
                  } ${
                    domainCheckStatus === 'available' ? 'border-green-500 dark:border-green-600' : 
                    domainCheckStatus === 'taken' ? 'border-red-500 dark:border-red-600' : ''
                  }`}
                />
              </div>
              <Select
                value={domainExtension}
                onValueChange={setDomainExtension}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-12 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=".edu.in">.edu.in</SelectItem>
                  <SelectItem value=".ac.in">.ac.in</SelectItem>
                  <SelectItem value=".edu">.edu</SelectItem>
                  <SelectItem value=".org">.org</SelectItem>
                  <SelectItem value=".in">.in</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={handleCheckDomain}
                className="h-12 px-6 font-semibold border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!preferredDomain?.trim() || isSubmitting}
              >
                Check
              </Button>
            </div>
            {preferredDomain && (
              <DomainChecker 
                domain={preferredDomain}
                extension={domainExtension}
                triggerCheck={triggerDomainCheck}
                onCheckComplete={(status) => {
                  handleDomainCheckComplete(status);
                }}
              />
            )}
          </FormField>
        </div>

        {/* Timeline Section */}
        <div className="space-y-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
            Timeline
          </h3>

          {/* Timeline */}
          <div className="space-y-3">
            <Label className="text-base font-semibold text-gray-900 dark:text-white">
              When do you need this?
              <span className="text-red-500 ml-1.5">*</span>
            </Label>

            <RadioGroup
              onValueChange={(value) => setValue('timeline', value as any, { shouldDirty: true })}
              disabled={isSubmitting}
              className="space-y-3"
            >
              {TIMELINE_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className="relative flex items-center gap-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer bg-white dark:bg-gray-900"
                >
                  <RadioGroupItem value={option.value} id={option.value} className="shrink-0" />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer flex items-baseline gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {option.label}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {option.sublabel}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {errors.timeline && (
              <div className="flex items-start space-x-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium">{errors.timeline.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="space-y-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
            Additional Information
          </h3>

          {/* Current Email System */}
          <FormField
            label="Current Email System"
            name="currentEmailSystem"
            error={errors.currentEmailSystem?.message}
          >
            <Select
              onValueChange={(value) => setValue('currentEmailSystem', value, { shouldDirty: true })}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select current system (optional)" />
              </SelectTrigger>
              <SelectContent>
                {CURRENT_EMAIL_SYSTEMS.map((system) => (
                  <SelectItem key={system} value={system}>
                    {system}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Additional Comments */}
          <FormField
            label="Comments/Requirements"
            name="comments"
            error={errors.comments?.message}
          >
            <Textarea
              {...register('comments')}
              placeholder="Any specific requirements or questions?"
              disabled={isSubmitting}
              className="min-h-[120px] resize-y"
              maxLength={500}
            />
            <div className="text-xs text-gray-400 text-right mt-2">
              {watch('comments')?.length || 0}/500
            </div>
          </FormField>
        </div>

        {/* Submit Button */}
        <div className="pt-8 border-t-2 border-gray-200 dark:border-gray-700">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 hover:from-blue-700 hover:via-blue-800 hover:to-blue-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Request Free Consultation
              </>
            )}
          </Button>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
            Our team will contact you within 24 hours
          </p>

          <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-3 flex items-center justify-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your information is secure and confidential
          </p>
        </div>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        institutionName={formData.institutionName}
        officialEmail={formData.officialEmail}
        phoneNumber={formData.phoneNumber}
      />
    </>
  );
}
