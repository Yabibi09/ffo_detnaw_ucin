// src/firebase.js
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
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

// 1) 여기에 Firebase 콘솔에서 복사한 config로 바꿔 붙여넣으세요.
const firebaseConfig = {
  apiKey: "AIzaSyAY_IG4sxWGqsViGukkGw4SK2VzP23jDI0",
  authDomain: "ffo-detnaw-ucin.firebaseapp.com",
  projectId: "ffo-detnaw-ucin",
  storageBucket: "ffo-detnaw-ucin.firebasestorage.app",
  messagingSenderId: "218591648921",
  appId: "1:218591648921:web:aaa6f9e69b2f70cd9f6c08"
};

// 2) Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 3) Auth 컨텍스트 생성
const AuthContext = createContext();

// 4) AuthProvider 컴포넌트 (앱 최상위에서 래핑)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // 관리자 여부 확인 (admins 컬렉션에 UID 문서가 있으면 관리자)
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

// 5) useAuth 훅
export function useAuth() {
  return useContext(AuthContext);
}
