import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, COLLECTIONS } from '../lib/appwrite';
import { useAuth } from '../contexts/AuthContext';

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
        setRole(doc.role || 'user');
      } catch {
        // Document not found — default to regular user
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  return { role, isAdmin: role === 'admin', loading, error };
}
