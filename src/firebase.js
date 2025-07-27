import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState, createContext } from 'react';

// TODO: Firebase 프로젝트 설정에서 복사한 config를 아래에 붙여넣으세요.
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAY_IG4sxWGqsViGukkGw4SK2VzP23jDI0",
  authDomain: "ffo-detnaw-ucin.firebaseapp.com",
  projectId: "ffo-detnaw-ucin",
  storageBucket: "ffo-detnaw-ucin.firebasestorage.app",
  messagingSenderId: "218591648921",
  appId: "1:218591648921:web:aaa6f9e69b2f70cd9f6c08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const db = getFirestore(firebase);

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
