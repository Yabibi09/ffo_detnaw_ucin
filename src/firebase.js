import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Init Firebase
const firebaseConfig = {
  // replace with your config
};
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
    const docu = snap.docs[0];
    const data = docu.data();
    if (data.password !== password) throw new Error('비밀번호가 틀렸습니다.');
    const usr = { id: docu.id, name, isAdmin: false };
    localStorage.setItem('user', JSON.stringify(usr));
    setUser(usr);
  };

  const signup = async (name, password) => {
    const q = query(collection(db, 'users'), where('name', '==', name));
    const snap = await getDocs(q);
    if (!snap.empty) throw new Error('이미 존재하는 이름입니다.');
    const ref = await addDoc(collection(db, 'users'), { name, password });
    const usr = { id: ref.id, name, isAdmin: false };
    localStorage.setItem('user', JSON.stringify(usr));
    setUser(usr);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, signup, logout, db }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
