'use client';

import { useRef, useState } from 'react';
import styles from '../shared/lab.module.css';

export default function Exercise() {
  const [display, setDisplay] = useState({ count: 0, observedRef: 0 });
  const countRef = useRef(0);
  return (
    <section className={styles.intro}>
      <p>Nơi bắt đầu: hãy đổi dòng chữ này rồi lưu để thấy project cập nhật.</p>
      <p>State hiển thị: {display.count} — Ref đọc ở lần bấm state gần nhất: {display.observedRef}</p>
      <div className={styles.counter}>
        <button onClick={() => setDisplay({ count: display.count + 1, observedRef: countRef.current })} style={{ padding: 14 }}>Tăng state → giao diện đổi</button>
        <button onClick={() => { countRef.current += 1; }} style={{ padding: 14 }}>Tăng ref → chờ lần render tiếp</button>
      </div>
      <p>Bấm ref ba lần rồi bấm state. Quan sát để hiểu ref lưu giá trị mà không tự yêu cầu React render lại.</p>
    </section>
  );
}
