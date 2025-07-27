import React, { useState } from 'react';
import { useAuth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!email || !password) return alert('이메일과 비밀번호를 입력하세요.');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/calendar');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '320px', margin: 'auto' }}>
      <h2>{mode === 'login' ? '로그인' : '회원가입'}</h2>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setMode('login')} style={mode==='login'?{background:'#4ea8de',color:'white'}:{}}>로그인</button>
        <button onClick={() => setMode('signup')} style={mode==='signup'?{background:'#4ea8de',color:'white'}:{}}>회원가입</button>
      </div>
      <input placeholder="이메일" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:'8px',marginBottom:'12px'}}/>
      <input type="password" placeholder="비밀번호" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:'8px',marginBottom:'16px'}}/>
      <button className="bubble-button" onClick={handleAuth} style={{width:'100%'}}>
        {mode==='login'?'로그인':'회원가입'}
      </button>
    </div>
); }