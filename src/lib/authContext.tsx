'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  updateProfile, sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, creatorName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, firebaseUser: null, loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  resetPassword: async () => {},
  logout: async () => {},
});

async function ensureUserDoc(fbUser: FirebaseUser, overrideName?: string): Promise<User> {
  const userRef = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) return snap.data() as User;

  const displayName = overrideName || fbUser.displayName || fbUser.email?.split('@')[0] || 'Creator';
  const newUser: User = {
    id: fbUser.uid,
    email: fbUser.email || '',
    displayName,
    creatorName: displayName,
    avatarColor: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
  };
  await setDoc(userRef, newUser);
  return newUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]               = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const u = await ensureUserDoc(fbUser);
        setUser(u);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string, creatorName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Set display name on Firebase Auth profile
    await updateProfile(cred.user, { displayName: creatorName });
    // Create Firestore user doc with the chosen name
    await ensureUserDoc(cred.user, creatorName);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
