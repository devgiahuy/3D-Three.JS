
import styles from "./page.module.css";
import Bai2 from "@/component/Bai2";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Bai2 />
      </main>
    </div>
  );
}
