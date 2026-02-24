import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { useAuth } from '../contexts/AuthContext';

const ADMIN_IDS = ['68ff4c5816bf5338810a', '68fe7498057792229b3d'];

interface UseUserRoleResult {
  role: string;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

export function useUserRole(): UseUserRoleResult {
  const { user } = useAuth();
  const [role, setRole] = useState('guest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setRole('guest');
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        setLoading(true);
        const doc = await databases.getDocument(
          DATABASE_ID,
          COLLECTIONS.USERS_META,
          user.$id
        );
        setRole(doc.role || 'student');
      } catch (err) {
        console.warn('useUserRole failed to fetch user doc:', err);
        // Document not found — default to regular user
        setRole('student');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  // Check both the fetched role and the hardcoded IDs for robustness
  const isUserAdmin = Boolean(role === 'admin' || (user && user.$id && ADMIN_IDS.includes(user.$id)));

  console.log(`[useUserRole] evaluated - user ID: ${user?.$id}, role state: ${role}, loading: ${loading}, isUserAdmin: ${isUserAdmin}`);

  return { role: isUserAdmin ? 'admin' : role, isAdmin: isUserAdmin, loading, error };
}
