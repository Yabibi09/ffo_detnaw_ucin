import React, { useState } from 'react';
import { useAuth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!name || !password) return alert('이름과 비밀번호를 입력하세요.');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(name, password);
      } else {
        await signup(name, password);
      }
      navigate('/calendar');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-box">
      <h2>{mode === 'login' ? '로그인' : '회원가입'}</h2>
      <div className="mode-switch">
        <button onClick={() => setMode('login')} className={mode==='login'?'active':''}>로그인</button>
        <button onClick={() => setMode('signup')} className={mode==='signup'?'active':''}>회원가입</button>
      </div>
      <input
        placeholder="이름"
        value={name}
        onChange={e => setName(e.target.value)}
        disabled={loading}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={loading}
      />
      <button
        className="bubble-button"
        onClick={handleAuth}
        disabled={loading}
      >
        {loading ? <span className="spinner" /> : (mode === 'login' ? '로그인' : '회원가입')}
      </button>
    </div>
  );
}
