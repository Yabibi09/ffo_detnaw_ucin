import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useAuth } from '../firebase';
import { collection, query, onSnapshot, addDoc, writeBatch, doc as docRef } from 'firebase/firestore';
import './CalendarPage.css';

export default function CalendarPage() {
  const { user, logout, db } = useAuth();
  const [signups, setSignups] = useState([]);
  const [selected, setSelected] = useState([]);

  // 실시간 구독으로 데이터 로드
  useEffect(() => {
    const q = query(collection(db, 'signups'));
    const unsub = onSnapshot(q, snapshot => {
      setSignups(snapshot.docs.map(d => d.data()));
    });
    return () => unsub();
  }, [db]);

  const onDateClick = day => {
    const iso = day.toISOString().slice(0, 10);
    const count = signups.filter(s => s.date === iso).length;
    if (count >= 3) return;
    setSelected(sel =>
      sel.includes(iso)
        ? sel.filter(x => x !== iso)
        : sel.length < 3
          ? [...sel, iso]
          : sel
    );
  };

  // 선택한 날짜 일괄 쓰기
  const handleSubmit = async () => {
    if (!selected.length) return;
    const batch = writeBatch(db);
    selected.forEach(d => {
      const ref = docRef(collection(db, 'signups'));
      batch.set(ref, { uid: user.id, date: d, name: user.name });
    });
    await batch.commit();
    setSelected([]);
  };

  // 그룹화
  const grouped = signups.reduce((acc, cur) => {
    acc[cur.date] = acc[cur.date] || [];
    acc[cur.date].push(cur.name);
    return acc;
  }, {});

  return (
    <div className="calendar-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
        <div>안녕하세요, <strong>{user.name}</strong>님</div>
        <button className="bubble-button" onClick={logout}>로그아웃</button>
      </header>

      <h2 style={{ textAlign: 'center', margin: 20 }}>신청 달력</h2>
      <Calendar
        onClickDay={onDateClick}
        tileClassName={({ date: d }) => {
          const classes = [];
          const iso = d.toISOString().slice(0,10);
          if (d.getDay() === 0) classes.push('sun');
          if (d.getDay() === 6) classes.push('sat');
          if (grouped[iso]?.length >= 3) classes.push('full');
          if (selected.includes(iso)) classes.push('selected');
          return classes.join(' ');
        }}
        calendarType="US"
      />

      <button
        className="bubble-button"
        onClick={handleSubmit}
        disabled={!selected.length}
        style={{ margin: '16px auto', display: 'block' }}
      >
        신청 완료 ({selected.length})
      </button>

      <h3 style={{ marginLeft: 20 }}>신청 현황</h3>
      <ul style={{ padding: '0 20px' }}>
        {Object.entries(grouped).map(([d, names]) => (
          <li key={d}>{d}: {names.length}/3 ({names.join(', ')})</li>
        ))}
      </ul>
    </div>
);
}
