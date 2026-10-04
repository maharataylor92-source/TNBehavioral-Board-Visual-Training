import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logoutUser, handleFirestoreError, OperationType } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isAuthReady: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  isAuthReady: false,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthReady(true);
      setLoading(false);

      if (user) {
        // Sync or initialize user profile document in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (!docSnap.exists()) {
            await setDoc(userDocRef, {
              userId: user.uid,
              email: user.email || 'user@example.com',
              displayName: user.displayName || 'RBT Candidate',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.warn('User profile sync notice:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, isAuthReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
