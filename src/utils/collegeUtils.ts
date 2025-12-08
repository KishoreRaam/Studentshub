/**
 * Utility functions for handling college data from colleges_merged.json
 * Provides state and district filtering capabilities
 */

export interface College {
  name: string;
  state: string;
  district: string;
  address: string;
  aisheCode: string;
  type: string;
}

let collegesCache: College[] | null = null;

/**
 * Fetch and cache colleges data
 */
export async function fetchColleges(): Promise<College[]> {
  if (collegesCache) {
    return collegesCache;
  }

  try {
    const res = await fetch("/assets/colleges_merged.json");
    const colleges: College[] = await res.json();
    collegesCache = colleges;
    return colleges;
  } catch (error) {
    console.error("Failed to fetch colleges:", error);
    return [];
  }
}

/**
 * Get unique states from colleges data
 */
export function getUniqueStates(colleges: College[]): string[] {
  const states = new Set<string>();
  colleges.forEach(college => {
    if (college.state) {
      states.add(college.state);
    }
  });
  return Array.from(states).sort();
}

/**
 * Get districts for a specific state
 */
export function getDistrictsByState(colleges: College[], state: string): string[] {
  const districts = new Set<string>();
  colleges
    .filter(college => college.state === state)
    .forEach(college => {
      if (college.district) {
        districts.add(college.district);
      }
    });
  return Array.from(districts).sort();
}

/**
 * Filter colleges by state
 */
export function filterByState(colleges: College[], state: string): College[] {
  return colleges.filter(college => college.state === state);
}

/**
 * Filter colleges by state and district
 */
export function filterByStateAndDistrict(
  colleges: College[],
  state: string,
  district: string
): College[] {
  return colleges.filter(
    college => college.state === state && college.district === district
  );
}

/**
 * Search colleges by name (case-insensitive)
 */
export function searchCollegesByName(colleges: College[], searchTerm: string): College[] {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return colleges;
  
  return colleges.filter(college =>
    college.name.toLowerCase().includes(term)
  );
}
