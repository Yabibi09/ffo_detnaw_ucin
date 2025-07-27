import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useAuth } from '../firebase';

export default function CalendarPage() {
  const { user, db } = useAuth();
  const [date, setDate] = useState(new Date());
  const [signups, setSignups] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const q = query(collection(db,'signups'));
    const snapshot = await getDocs(q);
    setSignups(snapshot.docs.map(doc=>({id:doc.id,...doc.data()})));
  };

  const onDateClick = day => {
    const d = day.toISOString().split('T')[0];
    const count = signups.filter(s=>s.date===d).length;
    if(count>=3) return alert('이미 최대 인원이 신청되었습니다.');
    if(selected.includes(d)) setSelected(selected.filter(x=>x!==d));
    else {
      if(selected.length>=3) return alert('한 번에 최대 3일만 신청 가능합니다.');
      setSelected([...selected,d]);
    }
  };

  const submit = async ()=>{
    for(let d of selected){
      await addDoc(collection(db,'signups'),{uid:user.uid,date:d,name:user.name});
    }
    setSelected([]); fetchData();
  };

  return (
    <div className="calendar-container">
      <h2>신청 달력</h2>
      <Calendar onChange={setDate} value={date} onClickDay={onDateClick} calendarType="US"/>
      <button className="bubble-button" onClick={submit}>신청 완료</button>
      <h3>신청 현황</h3>
      <ul>
        {Object.entries(signups.reduce((acc,cur)=>{
          acc[cur.date]=acc[cur.date]||[]; acc[cur.date].push(cur.name); return acc;
        },{})).map(([d,names])=>(
          <li key={d}>{d}: {names.length}/3 ({names.join(', ')})</li>
        ))}
      </ul>
    </div>
