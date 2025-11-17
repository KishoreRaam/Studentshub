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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Institution Details Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Institution Details
          </h3>

          {/* Institution Name */}
          <FormField
            label="Institution Name"
            name="institutionName"
            error={errors.institutionName?.message}
            required
            showSuccess={dirtyFields.institutionName && !errors.institutionName}
            helpText="Full legal name of your institution"
          >
            <Input
              {...register('institutionName')}
              placeholder="e.g., PSG College of Technology"
              disabled={isSubmitting}
              className="h-11"
            />
          </FormField>

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
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select institution type" />
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

          {/* State and District */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <SelectTrigger className="h-11">
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

            {/* District (conditional) */}
            {selectedState && (
              <FormField
                label="District"
                name="district"
                error={errors.district?.message}
                required
              >
                <Select
                  onValueChange={(value) => setValue('district', value, { shouldDirty: true })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {(DISTRICTS_BY_STATE[selectedState] || []).map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}
          </div>

          {/* Student Strength and Departments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Student Strength"
              name="studentStrength"
              error={errors.studentStrength?.message}
              required
              helpText="Total number of students (100-50,000)"
            >
              <Input
                {...register('studentStrength', { valueAsNumber: true })}
                type="number"
                placeholder="e.g., 2500"
                disabled={isSubmitting}
                className="h-11"
                min="100"
                max="50000"
              />
            </FormField>

            <FormField
              label="Number of Departments"
              name="departments"
              error={errors.departments?.message}
              required
              helpText="Total departments/courses offered"
            >
              <Input
                {...register('departments', { valueAsNumber: true })}
                type="number"
                placeholder="e.g., 8"
                disabled={isSubmitting}
                className="h-11"
                min="1"
                max="100"
              />
            </FormField>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
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
            <Input
              {...register('principalName')}
              placeholder="e.g., Dr. Rajesh Kumar"
              disabled={isSubmitting}
              className="h-11"
            />
          </FormField>

          {/* Official Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Official Email"
              name="officialEmail"
              error={errors.officialEmail?.message}
              required
              helpText="Use institutional email (.edu, .ac, .org, .gov)"
              showSuccess={dirtyFields.officialEmail && !errors.officialEmail}
            >
              <Input
                {...register('officialEmail')}
                type="email"
                placeholder="principal@institution.edu.in"
                disabled={isSubmitting}
                className="h-11"
              />
            </FormField>

            <FormField
              label="Phone Number"
              name="phoneNumber"
              error={errors.phoneNumber?.message}
              required
              helpText="10-digit Indian mobile number"
              showSuccess={dirtyFields.phoneNumber && !errors.phoneNumber}
            >
              <Input
                {...register('phoneNumber')}
                type="tel"
                placeholder="9876543210"
                disabled={isSubmitting}
                className="h-11"
                maxLength={10}
              />
            </FormField>
          </div>

          {/* Preferred Domain */}
          <FormField
            label="Preferred Domain Name"
            name="preferredDomain"
            error={errors.preferredDomain?.message}
            helpText="Choose a domain for your institutional emails (e.g., 'psgtech' for psgtech.edu.in)"
          >
            <Input
              {...register('preferredDomain')}
              placeholder="yourcollegename"
              disabled={isSubmitting}
              className="h-11"
            />
            {preferredDomain && <DomainChecker domain={preferredDomain} />}
          </FormField>
        </div>

        {/* Timeline & Current System Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Implementation Details
          </h3>

          {/* Timeline */}
          <FormField
            label="When do you need this setup?"
            name="timeline"
            error={errors.timeline?.message}
            required
          >
            <RadioGroup
              onValueChange={(value) => setValue('timeline', value as any, { shouldDirty: true })}
              disabled={isSubmitting}
              className="space-y-3"
            >
              {TIMELINE_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormField>

          {/* Current Email System */}
          <FormField
            label="Current Email System (if any)"
            name="currentEmailSystem"
            error={errors.currentEmailSystem?.message}
            helpText="Let us know what you're currently using"
          >
            <Select
              onValueChange={(value) => setValue('currentEmailSystem', value, { shouldDirty: true })}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select current system" />
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
            label="Additional Comments or Requirements"
            name="comments"
            error={errors.comments?.message}
            helpText="Any specific requirements or questions (max 500 characters)"
          >
            <Textarea
              {...register('comments')}
              placeholder="Tell us about any specific needs or questions..."
              disabled={isSubmitting}
              className="min-h-[100px] resize-y"
              maxLength={500}
            />
            <div className="text-xs text-gray-400 text-right mt-1">
              {watch('comments')?.length || 0} / 500
            </div>
          </FormField>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit Registration
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">
            By submitting this form, you agree to our terms of service and privacy policy.
            <br />
            Form is auto-saved every 2 seconds.
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
