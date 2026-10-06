import Link from 'next/link';
import { levels } from '@/learning/catalog';
import styles from './learn.module.css';
import ThemeToggle from '@/learning/shared/ThemeToggle';

export default function LearningHome() {
  return (
    <div className={styles.shell}>
      <main className={styles.page}>
        <nav className={styles.nav}><span className={styles.eyebrow}>SMART KIDS · KHU HỌC 3D</span><div className={styles.navActions}><ThemeToggle /><Link href="/" prefetch={false}>Xem Bài 1–4 cũ</Link></div></nav>
        <h1>Hiểu một chuyển động,<br />rồi mới ghép thành hướng dẫn.</h1>
        <p>Bắt đầu từ kiến thức bạn đã ghi: tạo object, ánh sáng và transform. Mỗi level có nơi sửa code, hướng dẫn từng bài và ghi chú riêng.</p>
        <div className={styles.notice}>
          <h2>Điểm học tiếp: Level 02 — Animation</h2>
          <p>Ôn nhanh Level 01 nếu cần. Sau đó học một cube đứng yên, xoay, đi thẳng và đi A→B. Bài Mini Obstacle Course nhiều bước nằm ở cuối lộ trình.</p>
          <Link className={styles.action} href="/learn/level-02-animation" prefetch={false}>Mở bài animation đầu tiên →</Link>
        </div>
        <section className={styles.flow}>
          <h2>Một buổi học</h2>
          <ol>
            <li>Đọc Guide, dự đoán kết quả trước khi chạy.</li>
            <li>Mở file Exercise, chỉ thay một giá trị rồi quan sát.</li>
            <li>Tự giải thích và làm một biến thể nhỏ.</li>
            <li>Ghi Notes; chuyển level khi đạt checkpoint.</li>
          </ol>
        </section>
        <div className={styles.grid}>
          {levels.map((level) => (
            <Link key={level.id} href={`/learn/${level.id}`} className={styles.card} prefetch={false}>
              <span className={styles.badge}>LEVEL {level.number} · {Number(level.number) <= 2 ? 'Có bài để chạy và sửa' : 'Workspace và đề bài'}</span>
              <strong>{level.title}</strong>
              <p>{level.focus}</p>
            </Link>
          ))}
        </div>
        <section className={styles.files}>
          <h2>Đọc, làm và ghi ở đâu?</h2>
          <p>Roadmap: <code>Docs/3D_Learning_Roadmap.md</code></p>
          <p>Hướng dẫn: <code>Docs/Learning-Levels/&lt;level&gt;/Guide.md</code></p>
          <p>Sửa code: <code>src/learning/&lt;level&gt;/Exercise.tsx</code></p>
          <p>Ghi lại điều đã hiểu: <code>Docs/Learning-Levels/&lt;level&gt;/Notes.md</code></p>
          <p>Level 03–08 là nơi tự triển khai sau khi học đủ phần trước. Code mẫu có sẵn không đồng nghĩa bạn đã hoàn thành level.</p>
        </section>
      </main>
    </div>
  );
}
