import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState, createContext } from 'react';

// TODO: Firebase 프로젝트 설정에서 복사한 config를 아래에 붙여넣으세요.
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Check if admin
        const adminDoc = await getDoc(doc(db, 'admins', u.uid));
        const isAdmin = adminDoc.exists();
        setUser({ uid: u.uid, email: u.email, isAdmin });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, db }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}