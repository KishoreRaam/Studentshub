/**
 * Utility functions for handling stream/major department values
 */

export const STREAM_OPTIONS = {
  "Computer_Science_&_Engineering": "Computer Science & Engineering",
  "Information_Technology": "Information Technology",
  "Mechanical_Engineering": "Mechanical Engineering",
  "Electrical_Engineering": "Electrical Engineering",
  "Electronics_&_Communication_Engineering": "Electronics & Communication Engineering",
  "Civil_Engineering": "Civil Engineering",
  "Mechatronics_Engineering": "Mechatronics Engineering",
  "Data_Science_&_Analytics": "Data Science & Analytics",
  "Business_&_Management": "Business & Management",
  "Design_&_Architecture": "Design & Architecture",
  "Arts_&_Humanities": "Arts & Humanities",
  "Life_Sciences_&_Biotechnology": "Life Sciences & Biotechnology",
  "Mathematics_&_Statistics": "Mathematics & Statistics",
  "Media_&_Communication": "Media & Communication",
  "Other": "Other"
};

/**
 * Convert stream enum key to human-readable label
 * @param streamKey - The enum key (e.g., "Mechatronics_Engineering")
 * @returns Human-readable label (e.g., "Mechatronics Engineering")
 */
export function getStreamLabel(streamKey: string | undefined): string {
  if (!streamKey) return '';
  
  // If it's already a label (contains spaces), return as is
  if (streamKey.includes(' ')) {
    return streamKey;
  }
  
  // Look up the label from the enum
  return STREAM_OPTIONS[streamKey as keyof typeof STREAM_OPTIONS] || streamKey;
}

/**
 * Get all stream options as array of {key, label} objects
 */
export function getStreamOptions(): Array<{ key: string; label: string }> {
  return Object.entries(STREAM_OPTIONS).map(([key, label]) => ({
    key,
    label
  }));
}
