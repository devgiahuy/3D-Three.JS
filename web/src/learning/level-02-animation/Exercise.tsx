'use client';

import { useState } from 'react';
import Static from './01-static/Exercise';
import Rotation from './02-rotation/Exercise';
import Linear from './03-linear/Exercise';
import Duration from './04-duration/Exercise';
import Wave from './05-wave/Exercise';
import Jump from './06-jump/Exercise';
import styles from '../shared/lab.module.css';

const lessons = [
  { id: '01-static', title: '01 — Đứng yên: đặt vị trí một lần', component: Static, hint: 'Đổi position.x rồi lưu. Vòng lặp render có thể chạy mà vật vẫn đứng yên.' },
  { id: '02-rotation', title: '02 — Xoay: góc từ tốc độ và thời gian', component: Rotation, hint: 'PI/2 rad/giây: sau 1 giây góc xoay là 90 độ. Đổi trục và tốc độ riêng từng lần.' },
  { id: '03-linear', title: '03 — Đi thẳng: start + speed × elapsed', component: Linear, hint: 'Bắt đầu x=-2, tốc độ 1. Dự đoán x tại giây 1, 2, 3 trước khi chạy.' },
  { id: '04-duration', title: '04 — A→B: đích cố định, thời lượng cố định', component: Duration, hint: 'progress 0..1 là phần quãng đường đã đi. Pause, chờ rồi Chạy lại để kiểm tra thời gian.' },
  { id: '05-wave', title: '05 — Lên xuống: sin và biên độ', component: Wave, hint: 'baseY là độ cao giữa; amplitude là độ nhấp nhô. Chưa cần học đường tròn.' },
  { id: '06-jump', title: '06 — Vượt thanh: một vòm nhảy minh họa', component: Jump, hint: 'Ghép X đi A→B và Y lên rồi xuống bằng cùng progress. Chưa có physics.' },
];

export default function Exercise() {
  const [index, setIndex] = useState(0);
  const lesson = lessons[index];
  const Current = lesson.component;
  return (
    <div>
      <label htmlFor="animation-lesson">Chọn bài theo thứ tự 01 → 06</label>
      <select id="animation-lesson" className={styles.selector} value={index} onChange={(event) => setIndex(Number(event.target.value))}>
        {lessons.map((item, position) => <option key={item.id} value={position}>{item.title}</option>)}
      </select>
      <p className={styles.intro}>{lesson.hint}</p>
      <p className={styles.intro}>File sửa: <code>src/learning/level-02-animation/{lesson.id}/Exercise.tsx</code></p>
      <Current key={lesson.id} />
    </div>
  );
}
