import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  name: string;
  age: number;
  degree: string;
  college: string;
  interests: string[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isDemoMode: boolean;
  setDemoMode: (demo: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const setDemoMode = (demo: boolean) => {
    setIsDemoMode(demo);
    if (demo) {
      // Set demo user profile
      setUserProfile({
        name: 'Demo User',
        age: 22,
        degree: 'B.Tech',
        college: 'Demo University',
        interests: ['Artificial Intelligence', 'Web Development', 'Data Science'],
        createdAt: new Date().toISOString()
      });
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setIsLoading(true);

      if (user && !isDemoMode) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else if (!isDemoMode) {
        setUserProfile(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isDemoMode,
    setDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
