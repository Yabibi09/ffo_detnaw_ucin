import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import api from '../api';

export default function CalendarPage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [date, setDate] = useState(new Date());
  const [signups, setSignups] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const su = await api.get('/signups');
    const as = await api.get('/assignments');
    setSignups(su.data);
    setAssignments(as.data);
  };

  const onDateClick = day => {
    const d = day.toISOString().split('T')[0];
    const count = signups.filter(s => s.date === d).length + assignments.filter(a => a.date === d).length;
    if (count >= 3) return alert('이미 최대 인원이 신청되었습니다.');
    if (selected.includes(d)) {
      setSelected(selected.filter(x => x !== d));
    } else {
      if (selected.length >= 3) return alert('한 번에 최대 3일만 신청 가능합니다.');
      setSelected([...selected, d]);
    }
  };

  const submit = async () => {
    for (let d of selected) {
      await api.post('/signups', { userId: user.id, date: d });
    }
    setSelected([]);
    fetchData();
  };

  return (
    <div className="calendar-container">
      <h2>신청 달력</h2>
      <Calendar
        onChange={setDate}
        value={date}
        onClickDay={onDateClick}
        calendarType="US"
      />
      <button className="bubble-button" onClick={submit}>신청 완료</button>
      <h3>신청 현황</h3>
      <ul>
        {signups.concat(assignments).map((s, idx) => (
          <li key={idx}>{s.date}: {s.userId}</li>
        ))}
      </ul>
    </div>
  );
}