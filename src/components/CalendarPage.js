import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useAuth } from '../firebase';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import './CalendarPage.css';

export default function CalendarPage() {
  const { user, db } = useAuth();
  const [date, setDate] = useState(new Date());
  const [signups, setSignups] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const q = query(collection(db, 'signups'));
    const snap = await getDocs(q);
    setSignups(snap.docs.map(d => d.data()));
  };

  const onDateClick = day => {
    const d = day.toISOString().slice(0,10);
    const count = signups.filter(s => s.date === d).length;
    if (count >= 3) return;
    if (selected.includes(d)) setSelected(selected.filter(x=>x!==d));
    else {
      if (selected.length >=3) return;
      setSelected([...selected,d]);
    }
  };

  const handleSubmit = async () => {
    if (!selected.length) return;
    setIsLoading(true);
    for (let d of selected) {
      await addDoc(collection(db,'signups'), { uid: user.id, date: d, name: user.name });
    }
    setSelected([]);
    await fetchData();
    setIsLoading(false);
  };

  const grouped = signups.reduce((a,c)=>{
    a[c.date] = a[c.date]||[];
    a[c.date].push(c.name);
    return a;
  }, {});

  return (
    <div className="calendar-container">
      <h2>신청 달력</h2>
      <Calendar
        onChange={setDate}
        value={date}
        onClickDay={onDateClick}
        tileClassName={({ date: d }) => {
          const day = d.toISOString().slice(0,10);
          const weekday = d.getDay();
          const classes = [];
          if (weekday === 0) classes.push('sun');
          if (weekday === 6) classes.push('sat');
          const count = signups.filter(s => s.date === day).length;
          if (count >= 3) classes.push('full-date');
          if (selected.includes(day)) classes.push('selected-date');
          return classes;
        }}
        calendarType="US"
      />
      <button
        className="bubble-button"
        onClick={handleSubmit}
        disabled={!selected.length || isLoading}
        style={{ marginTop:'16px', opacity: (!selected.length || isLoading)?0.6:1 }}
      >
        {isLoading ? '신청 중...' : '신청 완료'}
      </button>
      <h3>신청 현황</h3>
      <ul>
        {Object.entries(grouped).map(([d,names])=>(
          <li key={d}>{d}: {names.length}/3 ({names.join(', ')})</li>
        ))}
      </ul>
    </div>
);
}
