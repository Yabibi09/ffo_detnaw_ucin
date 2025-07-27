import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  addDoc,
  doc,
  getDoc
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

// Firebase 설정: 콘솔에서 복사한 값으로 교체
const firebaseConfig = {
  apiKey: "AIzaSyAY_IG4sxWGqsViGukkGw4SK2VzP23jDI0",
  authDomain: "ffo-detnaw-ucin.firebaseapp.com",
  projectId: "ffo-detnaw-ucin",
  storageBucket: "ffo-detnaw-ucin.firebasestorage.app",
  messagingSenderId: "218591648921",
  appId: "1:218591648921:web:aaa6f9e69b2f70cd9f6c08"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const adminSnap = await getDoc(doc(db, "admins", u.uid));
        setUser({ uid: u.uid, email: u.email, isAdmin: adminSnap.exists() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
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