import type { ReactNode } from 'react';
import Link from 'next/link';
import { levels, type LevelId } from '../catalog';
import styles from '@/app/learn/learn.module.css';
import ThemeToggle from './ThemeToggle';

export default function LevelPage({ levelId, children }: { levelId: LevelId; children: ReactNode }) {
  const index = levels.findIndex((level) => level.id === levelId);
  const level = levels[index];
  const previous = levels[index - 1];
  const next = levels[index + 1];
  return (
    <div className={styles.shell}>
      <main className={styles.page}>
        <nav className={styles.nav}><Link href="/learn" prefetch={false}>← Bản đồ các level</Link><div className={styles.navActions}><ThemeToggle /><Link href="/" prefetch={false}>Bài cũ</Link></div></nav>
        <p className={styles.eyebrow}>LEVEL {level.number}</p>
        <h1>{level.title}</h1>
        <p>{level.focus}</p>
        <p className={styles.notice}>{level.before}</p>
        <section className={styles.files}>
          <p>Đọc đề và gợi ý: <code>Docs/Learning-Levels/{level.id}/Guide.md</code></p>
          <p>File làm bài: <code>src/learning/{level.id}/Exercise.tsx</code></p>
          <p>Ghi lại dự đoán, kết quả và điều chưa hiểu: <code>Docs/Learning-Levels/{level.id}/Notes.md</code></p>
        </section>
        {children}
        <footer className={styles.footer}>
          {previous ? <Link href={`/learn/${previous.id}`} prefetch={false} className={styles.action}>← Level {previous.number}</Link> : <span />}
          {next ? <Link href={`/learn/${next.id}`} prefetch={false} className={styles.action}>Đạt checkpoint rồi tới Level {next.number} →</Link> : <Link href="/learn" className={styles.action} prefetch={false}>Về bản đồ</Link>}
        </footer>
      </main>
    </div>
  );
}
