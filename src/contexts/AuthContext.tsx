import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { logActivityToSheet, syncStudentToSheet } from '../lib/googleSheets';

type Role = 'student' | 'alumni' | 'admin' | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  loading: boolean;
  loginWithGoogle: (expectedRole: 'student' | 'alumni') => Promise<void>;
  loginWithEmail: (email: string, pass: string, expectedRole: 'student' | 'alumni') => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, expectedRole: 'student' | 'alumni') => Promise<void>;
  loginAdmin: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role as Role);
        } else {
          if (currentUser.email?.startsWith('admin@')) {
            setRole('admin');
            await setDoc(doc(db, 'users', currentUser.uid), { role: 'admin', email: currentUser.email });
          }
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const validateRole = async (uid: string, expectedRole: string) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const actualRole = userSnap.data().role;
      if (actualRole !== expectedRole) {
        throw new Error(`This account is already registered as a ${actualRole}. You cannot use the same account for the ${expectedRole} panel. Please use a different account or log in to the correct panel.`);
      }
      return true;
    }
    return false;
  };

  const loginWithGoogle = async (expectedRole: 'student' | 'alumni') => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email || '';
      
      if (expectedRole === 'alumni' && !email.endsWith('ac.in')) {
        await firebaseSignOut(auth);
        throw new Error('Only institutional academic accounts ending with ac.in are allowed for Alumni login.');
      }

      const userExists = await validateRole(result.user.uid, expectedRole).catch(async (err) => {
        await firebaseSignOut(auth);
        throw err;
      });

      if (!userExists) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          role: expectedRole,
          createdAt: new Date().toISOString()
        });
      }

      setRole(expectedRole);

      logActivityToSheet({
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        role: expectedRole,
        loginTime: new Date().toISOString(),
        browser: navigator.userAgent,
        status: 'Success'
      });

      if (expectedRole === 'student' && !userExists) {
        syncStudentToSheet({
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed before completing. Please try again.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your connection and try again.');
      } else if (error.message.includes('INTERNAL ASSERTION FAILED')) {
        throw new Error('An internal authentication error occurred. Please try refreshing the page.');
      }
      throw error;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, expectedRole: 'student' | 'alumni') => {
    if (expectedRole === 'alumni' && !email.endsWith('ac.in')) {
      throw new Error('Only institutional academic accounts ending with ac.in are allowed for Alumni registration.');
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(result.user, { displayName: name });

      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        name: name,
        role: expectedRole,
        createdAt: new Date().toISOString()
      });

      setRole(expectedRole);

      logActivityToSheet({
        uid: result.user.uid,
        name: name,
        email: result.user.email,
        role: expectedRole,
        loginTime: new Date().toISOString(),
        browser: navigator.userAgent,
        status: 'Success'
      });

      if (expectedRole === 'student') {
        syncStudentToSheet({
          uid: result.user.uid,
          name: name,
          email: result.user.email,
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/Password accounts are not enabled. Please enable them in the Firebase Console.');
      }
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string, expectedRole: 'student' | 'alumni') => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      
      await validateRole(result.user.uid, expectedRole).catch(async (err) => {
        await firebaseSignOut(auth);
        throw err;
      });

      setRole(expectedRole);

      logActivityToSheet({
        uid: result.user.uid,
        name: result.user.displayName || 'User',
        email: result.user.email,
        role: expectedRole,
        loginTime: new Date().toISOString(),
        browser: navigator.userAgent,
        status: 'Success'
      });
    } catch (error: any) {
      console.error('Email login error:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/Password accounts are not enabled. Please enable them in the Firebase Console.');
      }
      throw error;
    }
  };

  const loginAdmin = async (email: string, pass: string) => {
    // Strictly enforce the requested credentials
    if (email === 'admin@ksrce' && pass === 'admin@ksrce') {
      const internalEmail = 'admin@ksrce.ac.in';
      try {
        // Try to sign in first
        const result = await signInWithEmailAndPassword(auth, internalEmail, pass);
        setRole('admin');
        logActivityToSheet({
          uid: result.user.uid,
          name: 'Admin',
          email: internalEmail,
          role: 'admin',
          loginTime: new Date().toISOString(),
          browser: navigator.userAgent,
          status: 'Success'
        });
      } catch (error: any) {
        // If user doesn't exist, create it (auto-setup for the user)
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          try {
            const result = await createUserWithEmailAndPassword(auth, internalEmail, pass);
            await updateProfile(result.user, { displayName: 'Admin' });
            
            // Create the user document in Firestore
            await setDoc(doc(db, 'users', result.user.uid), {
              uid: result.user.uid,
              email: internalEmail,
              name: 'Admin',
              role: 'admin',
              createdAt: new Date().toISOString()
            });

            setRole('admin');
            logActivityToSheet({
              uid: result.user.uid,
              name: 'Admin',
              email: internalEmail,
              role: 'admin',
              loginTime: new Date().toISOString(),
              browser: navigator.userAgent,
              status: 'Success (Auto-Created)'
            });
          } catch (createError: any) {
            console.error('Admin auto-creation error:', createError);
            // If it's still an invalid credential error, it means the account exists but password was wrong
            if (error.code === 'auth/invalid-credential') {
              throw new Error('Invalid admin credentials.');
            }
            throw new Error('Failed to initialize admin account. Please check Firebase Console.');
          }
        } else {
          console.error('Admin login error:', error);
          throw new Error('Invalid admin credentials.');
        }
      }
    } else {
      throw new Error('Invalid admin credentials. Only the default admin account is allowed.');
    }
  };

  const logout = async () => {
    if (user) {
      logActivityToSheet({
        uid: user.uid,
        name: user.displayName || 'Admin',
        email: user.email,
        role: role,
        logoutTime: new Date().toISOString(),
        status: 'Logged Out'
      });
    }
    await firebaseSignOut(auth);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginWithGoogle, loginWithEmail, registerWithEmail, loginAdmin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
