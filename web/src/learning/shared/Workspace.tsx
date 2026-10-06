import { levels, type LevelId } from '../catalog';
import styles from '@/app/learn/learn.module.css';

export default function Workspace({ title, levelId }: { title: string; levelId: LevelId }) {
  const level = levels.find((item) => item.id === levelId);
  return (
    <section className={styles.flow}>
      <span className={styles.badge}>NƠI LÀM BÀI · CHƯA TRIỂN KHAI</span>
      <h2>{title}</h2>
      <p>{level?.focus}</p>
      <p>Mở Guide của level, làm bài đầu tiên rồi thay component này bằng phần bạn viết. Chỉ ghép thêm tính năng sau khi phần nhỏ đã chạy và bạn giải thích được.</p>
      <p>Gợi ý chung: đọc mục tiêu → dự đoán → tự viết phần nhỏ → chạy → ghi Notes. R3F/drei được cài khi tới Level 03.</p>
    </section>
  );
}
