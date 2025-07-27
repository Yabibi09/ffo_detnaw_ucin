import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAY_IG4sxWGqsViGukkGw4SK2VzP23jDI0",
  authDomain: "ffo-detnaw-ucin.firebaseapp.com",
  projectId: "ffo-detnaw-ucin",
  storageBucket: "ffo-detnaw-ucin.appspot.com",
  messagingSenderId: "218591648921",
  appId: "1:218591648921:web:aaa6f9e69b2f70cd9f6c08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Auth Context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (name, password) => {
    const q = query(collection(db, 'users'), where('name', '==', name));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error('등록된 사용자가 없습니다.');
    const data = snap.docs[0].data();
    if (data.password !== password) throw new Error('비밀번호가 틀렸습니다.');
    const usr = { id: snap.docs[0].id, name };
    localStorage.setItem('user', JSON.stringify(usr));
    setUser(usr);
  };

  const signup = async (name, password) => {
    const q = query(collection(db, 'users'), where('name', '==', name));
    const snap = await getDocs(q);
    if (!snap.empty) throw new Error('이미 존재하는 이름입니다.');
    const ref = await addDoc(collection(db, 'users'), { name, password });
    const usr = { id: ref.id, name };
    localStorage.setItem('user', JSON.stringify(usr));
    setUser(usr);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, db }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);