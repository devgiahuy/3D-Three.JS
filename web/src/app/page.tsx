import styles from "./page.module.css";
import Bai3 from "@/component/Bai3";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Bai3 />
      </main>
    </div>
  );
}
