import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!name || !password) return alert('이름과 비밀번호를 입력하세요.');
    // check existing
    const res = await api.get('/users', { params: { name } });
    const users = res.data;
    const existing = users.find(u => u.name === name);
    if (existing) {
      if (existing.password === password) {
        localStorage.setItem('user', JSON.stringify(existing));
        navigate(existing.role === 'admin' ? '/admin' : '/calendar');
      } else {
        alert('비밀번호가 틀렸습니다.');
      }
    } else {
      // register
      const newUser = { name, password, role: 'user' };
      const createRes = await api.post('/users', newUser);
      localStorage.setItem('user', JSON.stringify(createRes.data));
      navigate('/calendar');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>로그인 / 회원가입</h2>
      <input placeholder="이름" value={name} onChange={e => setName(e.target.value)} /><br /><br />
      <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} /><br /><br />
      <button className="bubble-button" onClick={handleLogin}>로그인</button>
    </div>
  );
}