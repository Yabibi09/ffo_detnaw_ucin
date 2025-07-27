// src/components/Login.js
import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' 또는 'signup'
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!name || !password) return alert('이름과 비밀번호를 입력하세요.');
    // 같은 이름의 사용자 조회
    const res = await api.get('/users', { params: { name } });
    const users = res.data;
    const existing = users.find(u => u.name === name);

    if (mode === 'login') {
      // 로그인 모드
      if (existing) {
        if (existing.password === password) {
          localStorage.setItem('user', JSON.stringify(existing));
          navigate(existing.role === 'admin' ? '/admin' : '/calendar');
        } else {
          alert('비밀번호가 틀렸습니다.');
        }
      } else {
        alert('등록된 사용자가 없습니다. 회원가입해주세요.');
      }
    } else {
      // 회원가입 모드
      if (existing) {
        alert('이미 존재하는 이름입니다. 다른 이름을 사용하세요.');
      } else {
        const newUser = { name, password, role: 'user' };
        const createRes = await api.post('/users', newUser);
        localStorage.setItem('user', JSON.stringify(createRes.data));
        navigate('/calendar');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '320px', margin: 'auto' }}>
      <h2>{mode === 'login' ? '로그인' : '회원가입'}</h2>
      <div style={{ marginBottom: '16px' }}>
        <button
          style={{
            marginRight: '8px',
            padding: '8px 16px',
            borderRadius: '16px',
            border: mode === 'login' ? 'none' : '1px solid #4ea8de',
            background: mode === 'login' ? '#4ea8de' : 'white',
            color: mode === 'login' ? 'white' : '#4ea8de',
            cursor: 'pointer'
          }}
          onClick={() => setMode('login')}
        >
          로그인
        </button>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: '16px',
            border: mode === 'signup' ? 'none' : '1px solid #4ea8de',
            background: mode === 'signup' ? '#4ea8de' : 'white',
            color: mode === 'signup' ? 'white' : '#4ea8de',
            cursor: 'pointer'
          }}
          onClick={() => setMode('signup')}
        >
          회원가입
        </button>
      </div>
      <input
        style={{ width: '100%', padding: '8px', marginBottom: '12px', boxSizing: 'border-box' }}
        placeholder="이름"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        style={{ width: '100%', padding: '8px', marginBottom: '16px', boxSizing: 'border-box' }}
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button
        className="bubble-button"
        style={{ width: '100%' }}
        onClick={handleAuth}
      >
        {mode === 'login' ? '로그인' : '회원가입'}
      </button>
    </div>
  );
}
