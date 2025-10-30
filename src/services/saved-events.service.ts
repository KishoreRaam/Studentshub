// Service for managing saved events
// Uses client-side Appwrite SDK with user session

import { databases, databaseId, COLLECTIONS, AppwriteID } from '../lib/appwrite';
import { Query, Permission, Role } from 'appwrite';

// Event Data interface for saving
export interface EventData {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  time: string;
  thumbnailUrl?: string;
  registrationLink?: string;
  organizer?: string;
  duration?: string;
  location?: string;
}

// Get all saved events for a user
export async function getSavedEvents(userId: string) {
  try {
    // Get all saved event records for this user
    const savedEventsResponse = await databases.listDocuments(
      databaseId,
      COLLECTIONS.SAVED_EVENTS,
      [Query.equal('userID', userId)]
    );

    if (savedEventsResponse.documents.length === 0) {
      return [];
    }

    // Return saved events with all their stored data
    return savedEventsResponse.documents.map(savedEvent => ({
      id: savedEvent.eventID,
      title: savedEvent.title || '',
      category: savedEvent.category || '',
      description: savedEvent.description || '',
      date: savedEvent.date || '',
      time: savedEvent.time || '',
      thumbnailUrl: savedEvent.thumbnailUrl || '',
      registrationLink: savedEvent.registrationLink || '',
      organizer: savedEvent.organizer || '',
      duration: savedEvent.duration || '',
      location: savedEvent.location || '',
      isSaved: true,
      registered: savedEvent.registered || false,
      registeredDate: savedEvent.registeredDate || null,
      reminderSent: savedEvent.reminderSent || false,
      notes: savedEvent.notes || '',
      savedId: savedEvent.$id, // Keep track of the saved_events document ID
    }));
  } catch (error) {
    console.error('Error getting saved events:', error);
    throw error;
  }
}

// Save an event for a user with full event data
export async function saveEvent(userId: string, eventData: EventData) {
  try {
    // Check if already saved
    try {
      const existing = await databases.listDocuments(
        databaseId,
        COLLECTIONS.SAVED_EVENTS,
        [
          Query.equal('userID', userId),
          Query.equal('eventID', eventData.id)
        ]
      );

      if (existing.documents.length > 0) {
        console.log('Event already saved, returning existing:', existing.documents[0].$id);
        return existing.documents[0]; // Already saved
      }
    } catch (queryError) {
      console.warn('Error checking for existing event, proceeding with save:', queryError);
      // Continue to create - might be a permission issue with query
    }

    // Create new saved event record with full event data
    const response = await databases.createDocument(
      databaseId,
      COLLECTIONS.SAVED_EVENTS,
      AppwriteID.unique(),
      {
        userID: userId,
        eventID: eventData.id,
        title: eventData.title,
        category: eventData.category,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        thumbnailUrl: eventData.thumbnailUrl || '',
        registrationLink: eventData.registrationLink || '',
        organizer: eventData.organizer || '',
        duration: eventData.duration || '',
        location: eventData.location || '',
        registered: false,
        registeredDate: null,
        reminderSent: false,
        notes: '',
      },
      [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ]
    );

    return response;
  } catch (error: any) {
    // If document already exists, try to fetch and return it
    if (error.code === 409 || error.message?.includes('already exists')) {
      console.log('Document already exists, fetching existing document...');
      try {
        const existing = await databases.listDocuments(
          databaseId,
          COLLECTIONS.SAVED_EVENTS,
          [
            Query.equal('userID', userId),
            Query.equal('eventID', eventData.id)
          ]
        );
        if (existing.documents.length > 0) {
          return existing.documents[0];
        }
      } catch (fetchError) {
        console.error('Error fetching existing document:', fetchError);
      }
    }
    console.error('Error saving event:', error);
    throw error;
  }
}

// Unsave an event
export async function unsaveEvent(savedEventId: string) {
  try {
    await databases.deleteDocument(
      databaseId,
      COLLECTIONS.SAVED_EVENTS,
      savedEventId
    );
  } catch (error) {
    console.error('Error unsaving event:', error);
    throw error;
  }
}

// Mark an event as registered (user clicked "Register Now")
export async function registerForEvent(savedEventId: string) {
  try {
    const response = await databases.updateDocument(
      databaseId,
      COLLECTIONS.SAVED_EVENTS,
      savedEventId,
      {
        registered: true,
        registeredDate: new Date().toISOString(),
      }
    );
    return response;
  } catch (error) {
    console.error('Error registering for event:', error);
    throw error;
  }
}

// Update event notes
export async function updateEventNotes(savedEventId: string, notes: string) {
  try {
    const response = await databases.updateDocument(
      databaseId,
      COLLECTIONS.SAVED_EVENTS,
      savedEventId,
      {
        notes: notes,
      }
    );
    return response;
  } catch (error) {
    console.error('Error updating event notes:', error);
    throw error;
  }
}

// Mark reminder as sent
export async function markReminderSent(savedEventId: string) {
  try {
    const response = await databases.updateDocument(
      databaseId,
      COLLECTIONS.SAVED_EVENTS,
      savedEventId,
      {
        reminderSent: true,
      }
    );
    return response;
  } catch (error) {
    console.error('Error marking reminder sent:', error);
    throw error;
  }
}
