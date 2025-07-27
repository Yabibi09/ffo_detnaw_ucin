import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc
} from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

// TODO: Firebase 콘솔에서 복사한 config로 교체
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = async (name, password) => {
    const q = query(collection(db, 'users'), where('name', '==', name));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error('등록된 사용자가 없습니다.');
    const docSnap = snap.docs[0];
    const data = docSnap.data();
    if (data.password !== password) throw new Error('비밀번호가 틀렸습니다.');
    const isAdmin = !!(await getDoc(doc(db, 'admins', docSnap.id))).exists();
    const userObj = { uid: docSnap.id, name, isAdmin };
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
  };

  const signup = async (name, password) => {
    const q = query(collection(db, 'users'), where('name', '==', name));
    const snap = await getDocs(q);
    if (!snap.empty) throw new Error('이미 존재하는 이름입니다.');
    const newDoc = await addDoc(collection(db, 'users'), { name, password });
    const isAdmin = false;
    const userObj = { uid: newDoc.id, name, isAdmin };
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
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

export function useAuth() {
  return useContext(AuthContext);
}
