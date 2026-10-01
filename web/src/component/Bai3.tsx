'use client';

import { useState } from 'react';
import Demo01Static from './bai3/demo-01-static/Demo01Static';
import Demo02RotationX from './bai3/demo-02-rotation-x/Demo02RotationX';
import Demo03RotationY from './bai3/demo-03-rotation-y/Demo03RotationY';
import Demo04RotationXY from './bai3/demo-04-rotation-xy/Demo04RotationXY';
import Demo05AnimationFrame from './bai3/demo-05-request-animation-frame/Demo05AnimationFrame';
import Demo06ElapsedTime from './bai3/demo-06-elapsed-time/Demo06ElapsedTime';
import Demo07SinMotion from './bai3/demo-07-sin-motion/Demo07SinMotion';
import Demo08CosMotion from './bai3/demo-08-cos-motion/Demo08CosMotion';
import Demo09PointLight from './bai3/demo-09-point-light/Demo09PointLight';
import Demo10PointLightCircle from './bai3/demo-10-point-light-circle/Demo10PointLightCircle';
import Demo11PointLightEllipse from './bai3/demo-11-point-light-ellipse/Demo11PointLightEllipse';
import Demo12PointLightVertical from './bai3/demo-12-point-light-vertical/Demo12PointLightVertical';
import Demo13Complete from './bai3/demo-13-complete/Demo13Complete';

const DEMOS = [
  { id: 1, name: '01. Static Object', component: Demo01Static },
  { id: 2, name: '02. Rotation X', component: Demo02RotationX },
  { id: 3, name: '03. Rotation Y', component: Demo03RotationY },
  { id: 4, name: '04. Rotation X + Y', component: Demo04RotationXY },
  { id: 5, name: '05. requestAnimationFrame', component: Demo05AnimationFrame },
  { id: 6, name: '06. Elapsed Time', component: Demo06ElapsedTime },
  { id: 7, name: '07. Sin Motion', component: Demo07SinMotion },
  { id: 8, name: '08. Cos Motion', component: Demo08CosMotion },
  { id: 9, name: '09. PointLight Static', component: Demo09PointLight },
  { id: 10, name: '10. PointLight Circle', component: Demo10PointLightCircle },
  { id: 11, name: '11. PointLight Ellipse', component: Demo11PointLightEllipse },
  { id: 12, name: '12. PointLight Vertical', component: Demo12PointLightVertical },
  { id: 13, name: '13. Complete Demo', component: Demo13Complete },
];

export default function Bai3() {
  const [activeDemoId, setActiveDemoId] = useState<number>(1);

  const ActiveComponent = DEMOS.find((d) => d.id === activeDemoId)?.component || Demo01Static;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Top Navigation Bar to select demos */}
      <div
        style={{
          position: 'absolute',
          top: 15,
          right: 20,
          zIndex: 100,
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        }}
      >
        <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', fontFamily: 'sans-serif' }}>
          Chọn Demo Bài 3:
        </label>
        <select
          value={activeDemoId}
          onChange={(e) => setActiveDemoId(Number(e.target.value))}
          style={{
            background: '#1e293b',
            color: '#38bdf8',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {DEMOS.map((demo) => (
            <option key={demo.id} value={demo.id}>
              {demo.name}
            </option>
          ))}
        </select>
      </div>

      {/* Render Active Demo Component */}
      <ActiveComponent />
    </div>
  );
}
