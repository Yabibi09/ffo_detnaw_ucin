import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useAuth } from '../firebase';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import './CalendarPage.css';

export default function CalendarPage() {
  const { user, db } = useAuth();
  const [signups, setSignups] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const snap = await getDocs(query(collection(db, 'signups')));
    setSignups(snap.docs.map(d => d.data()));
  };

  const onDateClick = day => {
    const d = day.toISOString().slice(0,10);
    const cnt = signups.filter(s => s.date === d).length;
    if (cnt >= 3) return;
    setSelected(sel => 
      sel.includes(d) ? sel.filter(x => x !== d) : sel.length < 3 ? [...sel, d] : sel
    );
  };

  const handleSubmit = async () => {
    if (!selected.length) return;
    for (const d of selected) {
      await addDoc(collection(db, 'signups'), { uid: user.id, date: d, name: user.name });
    }
    setSelected([]);
    fetchData();
  };

  const grouped = signups.reduce((acc, cur) => {
    acc[cur.date] = acc[cur.date] || [];
    acc[cur.date].push(cur.name);
    return acc;
  }, {});

  return (
    <div className="calendar-container">
      <h2>신청 달력</h2>
      <Calendar
        onClickDay={onDateClick}
        tileClassName={({ date }) => {
          const day = date.getDay();
          const iso = date.toISOString().slice(0,10);
          return [
            day === 0 ? 'sun' : '',
            day === 6 ? 'sat' : '',
            selected.includes(iso) ? 'selected' : '',
            grouped[iso]?.length >= 3 ? 'full' : ''
          ].join(' ');
        }}
      />
      <button
        className="bubble-button"
        onClick={handleSubmit}
        disabled={!selected.length}
        style={{ marginTop: '16px', opacity: !selected.length ? 0.6 : 1 }}
      >
        신청 완료
      </button>
      <h3>신청 현황</h3>
      <ul>
        {Object.entries(grouped).map(([date, names]) => (
          <li key={date}>
            {date}: {names.length}/3 ({names.join(', ')})
          </li>
        ))}
      </ul>
    </div>
  );
}
