import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useAuth } from '../firebase';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import './CalendarPage.css';

export default function CalendarPage() {
  const { user, logout, db } = useAuth();
  const [signups, setSignups] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(query(collection(db, 'signups')));
      setSignups(snap.docs.map(d => d.data()));
    })();
  }, [db]);

  const onDateClick = day => {
    const iso = day.toISOString().slice(0,10);
    if (signups.filter(s=>s.date===iso).length>=3) return;
    setSelected(sel=> sel.includes(iso)? sel.filter(x=>x!==iso): sel.length<3? [...sel,iso]: sel);
  };

  const handleSubmit = async () => {
    if (!selected.length) return;
    for (const d of selected) {
      await addDoc(collection(db, 'signups'), { uid: user.id, date: d, name: user.name });
    }
    setSelected([]);
    const snap = await getDocs(query(collection(db, 'signups')));
    setSignups(snap.docs.map(d => d.data()));
  };

  const grouped = signups.reduce((a,c)=>{ a[c.date]=a[c.date]||[]; a[c.date].push(c.name); return a; }, {});

  return (
    <div className="calendar-container">
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 20px'}}>
        <div>안녕하세요, <strong>{user.name}</strong>님</div>
        <button className="bubble-button" onClick={logout}>로그아웃</button>
      </header>
      <h2 style={{textAlign:'center',margin:'20px 0'}}>신청 달력</h2>
      <Calendar
        onClickDay={onDateClick}
        tileClassName={({date:d})=>{
          const day=d.getDay(), iso=d.toISOString().slice(0,10);
          return [
            day===0?'sun':'', day===6?'sat':'',
            grouped[iso]?.length>=3?'full':'',
            selected.includes(iso)?'selected':''
          ].join(' ');
        }}
        calendarType="US"
      />
      <button className="bubble-button" onClick={handleSubmit} disabled={!selected.length} style={{margin:'16px auto',display:'block'}}>
        신청 완료
      </button>
      <h3 style={{marginLeft:'20px'}}>신청 현황</h3>
      <ul style={{padding:'0 20px'}}>
        {Object.entries(grouped).map(([d,names])=>(
          <li key={d} style={{marginBottom:'8px'}}>{d}: {names.length}/3 ({names.join(', ')})</li>
        ))}
      </ul>
    </div>
); }
