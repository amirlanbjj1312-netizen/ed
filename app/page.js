import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.badge}>EDUMAP Desk</div>
        <h1>Finish school registration on desktop.</h1>
        <p className={styles.lede}>
          Your email is confirmed in the app. Now complete the full school
          profile on a laptop to unlock publishing and verification.
        </p>

        <div className={styles.actions}>
          <Link className={styles.primary} href="/school-registration">
            Start school registration
          </Link>
          <a className={styles.secondary} href="#steps">
            See how it works
          </a>
        </div>

        <div className={styles.panel} id="steps">
          <div>
            <span>01</span>
            <h3>Sign in with the same email</h3>
            <p>Use the account that confirmed the signup on your phone.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Fill in the school profile</h3>
            <p>Add license, contacts, programs, and public info.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Save and send for review</h3>
            <p>We will verify and publish the data for parents.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
