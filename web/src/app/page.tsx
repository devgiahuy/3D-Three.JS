'use client';

import { useState } from 'react';
import Bai1 from '@/component/Bai1';
import Bai2 from '@/component/Bai2';
import Bai3 from '@/component/Bai3';
import Bai4 from '@/component/Bai4';

const LESSONS = [
  { id: 1, name: 'Bài 1', title: 'Scene & Cube', component: Bai1 },
  { id: 2, name: 'Bài 2', title: 'Geometry & Material', component: Bai2 },
  { id: 3, name: 'Bài 3', title: 'Light & Animation', component: Bai3 },
  { id: 4, name: 'Bài 4', title: 'Hệ Tọa Độ & Transform (Chướng Ngại Vật)', component: Bai4 },
];

export default function Home() {
  const [activeLesson, setActiveLesson] = useState<number>(4);

  const CurrentLesson = LESSONS.find((l) => l.id === activeLesson)?.component || Bai4;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Top Navbar Switcher */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '14px',
          padding: '5px 8px',
          display: 'flex',
          gap: '6px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
        }}
      >
        {LESSONS.map((lesson) => {
          const isActive = activeLesson === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                background: isActive ? '#38bdf8' : 'transparent',
                color: isActive ? '#0f172a' : '#94a3b8',
                transition: 'all 0.2s ease',
              }}
              title={lesson.title}
            >
              {lesson.name}
              {lesson.id === 4 && ' 🔥'}
            </button>
          );
        })}
      </div>

      <main style={{ width: '100%', height: '100%' }}>
        <CurrentLesson />
      </main>
    </div>
  );
}
