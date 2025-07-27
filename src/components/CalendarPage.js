import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useAuth } from '../firebase';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';

export default function CalendarPage() {
  const { user, db } = useAuth();
  const [date, setDate] = useState(new Date());
  const [signups, setSignups] = useState([]);
  const [selected, setSelected] = useState([]);

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
    if (count >= 3) return alert('이미 최대 인원이 신청되었습니다.');
    if (selected.includes(d)) setSelected(selected.filter(x=>x!==d));
    else {
      if (selected.length >=3) return alert('최대 3일만 신청 가능합니다.');
      setSelected([...selected,d]);
    }
  };

  const handleSubmit = async () => {
    for (let d of selected) {
      await addDoc(collection(db,'signups'), { uid: user.id, date: d, name: user.name });
    }
    setSelected([]);
    fetchData();
  };

  const grouped = signups.reduce((a,c)=>{
    a[c.date]=a[c.date]||[];
    a[c.date].push(c.name);
    return a;
  }, {});

  return (
    <div className="calendar-container">
      <h2>신청 달력</h2>
      <Calendar onChange={setDate} value={date} onClickDay={onDateClick} calendarType="US"/>
      <button className="bubble-button" onClick={handleSubmit} style={{marginTop:'16px'}}>신청 완료</button>
      <h3>신청 현황</h3>
      <ul>
        {Object.entries(grouped).map(([d,names])=>(
          <li key={d}>{d}: {names.length}/3 ({names.join(', ')})</li>
        ))}
      </ul>
    </div>
);
}
