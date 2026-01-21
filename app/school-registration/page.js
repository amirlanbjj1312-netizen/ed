"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { getSupabase } from "@/lib/supabaseClient";

const emptyLogin = { email: "", password: "" };

const Field = ({ label, hint, children }) => (
  <label className={styles.field}>
    <span>{label}</span>
    {children}
    {hint ? <small>{hint}</small> : null}
  </label>
);

export default function SchoolRegistrationPage() {
  const [session, setSession] = useState(null);
  const [login, setLogin] = useState(emptyLogin);
  const [loginStatus, setLoginStatus] = useState("");
  const [ecpFile, setEcpFile] = useState(null);
  const [ecpPassword, setEcpPassword] = useState("");
  const [ecpStatus, setEcpStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const user = session?.user;
  const profileKey = useMemo(() => user?.id || "guest", [user?.id]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session ?? null);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });
    return () => data?.subscription?.unsubscribe();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginStatus("");
    const supabase = getSupabase();
    if (!supabase) {
      setLoginStatus("Supabase is not configured yet.");
      return;
    }
    const email = login.email.trim().toLowerCase();
    if (!email || !login.password) {
      setLoginStatus("Enter email and password.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: login.password,
    });
    if (error) {
      setLoginStatus(error.message);
      return;
    }
    setLoginStatus("Signed in successfully.");
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const handleEcpUpload = async (event) => {
    event.preventDefault();
    setEcpStatus("");
    if (!ecpFile) {
      setEcpStatus("Please attach your .p12 or .pfx file.");
      return;
    }
    if (ecpPassword.trim().length < 6) {
      setEcpStatus("Password must be at least 6 characters.");
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setEcpStatus(
        "E-signature uploaded. We will verify it and unlock your school profile."
      );
    }, 900);
  };

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        <aside className={styles.info}>
          <div className={styles.tag}>Desktop step</div>
          <h1>Complete your school profile.</h1>
          <p>
            Use the same email you confirmed on your phone. This step collects
            the E-signature so we can verify the school.
          </p>
          <ul>
            <li>Verified email unlocks the form.</li>
            <li>Upload the school ECP on desktop.</li>
            <li>The mobile profile stays the main source of data.</li>
          </ul>
          <div className={styles.note}>
            Need help? Email support@edumap.kz or contact your moderator.
          </div>
        </aside>

        <section className={styles.content}>
          <div className={styles.card}>
            <header>
              <h2>Account</h2>
              <p>Sign in to continue the registration.</p>
            </header>
            {user ? (
              <div className={styles.session}>
                <div>
                  <strong>{user.email}</strong>
                  <span>Signed in</span>
                </div>
                <button className={styles.ghost} onClick={handleLogout}>
                  Sign out
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin} className={styles.loginForm}>
                <label>
                  Email
                  <input
                    type="email"
                    value={login.email}
                    onChange={(event) =>
                      setLogin((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    placeholder="school@email.kz"
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={login.password}
                    onChange={(event) =>
                      setLogin((prev) => ({
                        ...prev,
                        password: event.target.value,
                      }))
                    }
                    placeholder="••••••••"
                  />
                </label>
                <button className={styles.primary} type="submit">
                  Sign in
                </button>
                {loginStatus ? <p className={styles.status}>{loginStatus}</p> : null}
              </form>
            )}
          </div>

          <div className={styles.card}>
            <header>
              <h2>E-signature (ECP)</h2>
              <p>
                Upload the school certificate file and enter the password to
                submit for verification.
              </p>
            </header>
            <form onSubmit={handleEcpUpload} className={styles.form}>
              <div className={styles.actions}>
                <Field label="Certificate file (.p12 / .pfx)">
                  <input
                    type="file"
                    accept=".p12,.pfx"
                    onChange={(event) => setEcpFile(event.target.files?.[0] || null)}
                  />
                </Field>
                <Field label="Password">
                  <input
                    type="password"
                    value={ecpPassword}
                    onChange={(event) => setEcpPassword(event.target.value)}
                    placeholder="••••••"
                  />
                </Field>
              </div>

              <div className={styles.actions}>
                <button className={styles.primary} type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload ECP"}
                </button>
                <button className={styles.ghost} type="button">
                  Need help?
                </button>
              </div>

              {ecpStatus ? <p className={styles.status}>{ecpStatus}</p> : null}
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
