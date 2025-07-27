// src/firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

// ── 1) 여기부터 ──
const firebaseConfig = {
  apiKey: "AIzaSyAY_IG4sxWGqsViGukkGw4SK2VzP23jDI0",
  authDomain: "ffo-detnaw-ucin.firebaseapp.com",
  projectId: "ffo-detnaw-ucin",
  storageBucket: "ffo-detnaw-ucin.appspot.com",      // .firebasestorage.app → .appspot.com 로 수정
  messagingSenderId: "218591648921",
  appId: "1:218591648921:web:aaa6f9e69b2f70cd9f6c08"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth Context 생성
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Firestore 'admins' 컬렉션에서 관리자 여부 확인
        const adminSnap = await getDoc(doc(db, 'admins', u.uid));
        setUser({ uid: u.uid, name: u.displayName || u.email, isAdmin: adminSnap.exists() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (name, password) => {
    // 이름 기반 커스텀 로그인
    return (async () => {
      const q = query(collection(db, 'users'), where('name', '==', name));
      const snap = await getDocs(q);
      if (snap.empty) throw new Error('등록된 사용자가 없습니다.');
      const docu = snap.docs[0];
      const data = docu.data();
      if (data.password !== password) throw new Error('비밀번호가 틀렸습니다.');
      const usr = { uid: docu.id, name, isAdmin: false };
      localStorage.setItem('user', JSON.stringify(usr));
      setUser(usr);
    })();
  };

  const signup = (name, password) => {
    // 이름 기반 커스텀 회원가입
    return (async () => {
      const q = query(collection(db, 'users'), where('name', '==', name));
      const snap = await getDocs(q);
      if (!snap.empty) throw new Error('이미 존재하는 이름입니다.');
      const ref = await addDoc(collection(db, 'users'), { name, password });
      const usr = { uid: ref.id, name, isAdmin: false };
      localStorage.setItem('user', JSON.stringify(usr));
      setUser(usr);
    })();
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, db }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
