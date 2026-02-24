import { useState, useMemo, useCallback } from 'react';
import { databases, DATABASE_ID, COLLECTIONS, AppwriteID, storage, eventMediaBucket, account } from '../lib/appwrite';
import { toast } from 'sonner';

export interface EventFormData {
  title: string;
  organizer: string;
  organizerEmail: string;
  phoneNumber: string;
  category: 'Webinar' | 'Hackathon' | 'Workshop' | 'Conference' | '';
  eventDate: string;
  time: string;
  location: string;
  description: string;
  registrationLink: string;
}

export interface FieldErrors {
  title?: string;
  organizer?: string;
  category?: string;
  eventDate?: string;
  time?: string;
  description?: string;
  registrationLink?: string;
}

const initialFormData: EventFormData = {
  title: '',
  organizer: '',
  organizerEmail: '',
  phoneNumber: '',
  category: '',
  eventDate: '',
  time: '',
  location: '',
  description: '',
  registrationLink: '',
};

const REQUIRED_FIELDS: (keyof EventFormData)[] = [
  'title', 'organizer', 'category', 'eventDate', 'time', 'description',
];

const URL_REGEX = /^https?:\/\/.+\..+/;

export function useEventForm() {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback(<K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => {
      if (prev[field as keyof FieldErrors]) {
        const next = { ...prev };
        delete next[field as keyof FieldErrors];
        return next;
      }
      return prev;
    });
  }, []);

  const handleSetPosterFile = useCallback((file: File | null) => {
    setPosterFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPosterPreview(url);
    } else {
      setPosterPreview(null);
    }
  }, []);

  const removePoster = useCallback(() => {
    if (posterPreview) {
      URL.revokeObjectURL(posterPreview);
    }
    setPosterFile(null);
    setPosterPreview(null);
  }, [posterPreview]);

  const progress = useMemo(() => {
    const filled = REQUIRED_FIELDS.filter(f => formData[f].trim() !== '').length;
    return Math.round((filled / REQUIRED_FIELDS.length) * 100);
  }, [formData]);

  const validate = useCallback((): boolean => {
    const errors: FieldErrors = {};

    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.organizer.trim()) errors.organizer = 'Organizer is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.time.trim()) errors.time = 'Time is required';

    if (!formData.eventDate) {
      errors.eventDate = 'Event date is required';
    } else {
      const selected = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) errors.eventDate = 'Event date cannot be in the past';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length > 5000) {
      errors.description = 'Description must be under 5000 characters';
    }

    if (formData.registrationLink.trim() && !URL_REGEX.test(formData.registrationLink.trim())) {
      errors.registrationLink = 'Please enter a valid URL (https://...)';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const submitEvent = useCallback(async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      let user: { $id: string } | null = null;
      try {
        user = await account.get();
      } catch {
        // User not logged in, will use 'anonymous'
      }

      let posterFileId: string | undefined;
      let thumbnailUrl: string | undefined;

      if (posterFile) {
        if (!user) {
          toast.error('You must be logged in to upload a poster. Submitting without poster.');
        } else {
          try {
            const uploaded = await storage.createFile(eventMediaBucket, AppwriteID.unique(), posterFile);
            posterFileId = uploaded.$id;
            thumbnailUrl = storage.getFilePreview(eventMediaBucket, uploaded.$id, 800, 400).toString();
          } catch (uploadErr: unknown) {
            const msg = uploadErr instanceof Error ? uploadErr.message : 'Unknown error';
            console.error('Poster upload failed:', uploadErr);
            toast.error(`Poster upload failed: ${msg}. Submitting without poster.`);
          }
        }
      }

      const userId = user?.$id || 'anonymous';

      const payload: Record<string, unknown> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        eventType: formData.category,
        status: 'Upcoming',
        eventDate: new Date(formData.eventDate).toISOString(),
        time: formData.time.trim() || '12:00 PM',
        organizer: formData.organizer.trim(),
        location: formData.location.trim() || 'Online',
        registrationLink: formData.registrationLink.trim() || 'N/A',
        submittedBy: userId,
        createdByUserId: userId,
        submitterType: 'student',
        approved: false,
        participantCount: 0,
        maxParticipants: 0,
        tags: [],
      };

      if (posterFileId) payload.posterFileId = posterFileId;
      if (thumbnailUrl) payload.thumbnailUrl = thumbnailUrl;

      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.EVENTS,
        AppwriteID.unique(),
        payload,
      );

      toast.success('Event submitted successfully! It will appear after moderation.');
      setIsSuccess(true);
      setFormData(initialFormData);
      removePoster();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit event';
      console.error('Event submission error:', err);
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, posterFile, validate, removePoster]);

  return {
    formData,
    updateField,
    posterFile,
    setPosterFile: handleSetPosterFile,
    removePoster,
    posterPreview,
    validate,
    fieldErrors,
    submitEvent,
    isSubmitting,
    isSuccess,
    error,
    progress,
  };
}
