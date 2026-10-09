
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function SignIn() {
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setBusy(true);

    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/signin`,
        });
        if (error) throw error;
        setMessage("If an account exists for this email, password reset instructions will be sent.");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/hub`,
          },
        });
        if (error) throw error;

        setMessage(
          data.session
            ? "Account created. You can continue to the hub."
            : "Account request received. Check your email to verify your account."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        window.location.assign("/hub");
      }
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  const heading =
    mode === "signup"
      ? "Create your Chatflix account"
      : mode === "reset"
        ? "Reset your password"
        : "Welcome back to Chatflix";

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Your Chatflix account</span>
          <h1>{heading}</h1>
          <p>Sign in or create an account to continue.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="legal-card" style={{ maxWidth: 480, margin: "0 auto" }}>
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: "block", width: "100%", margin: "8px 0 18px", padding: 12 }}
              />

              {mode !== "reset" && (
                <>
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    minLength={6}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ display: "block", width: "100%", margin: "8px 0 18px", padding: 12 }}
                  />
                </>
              )}

              <button
                className="btn btn-primary"
                type="submit"
                disabled={busy}
                style={{ width: "100%", cursor: busy ? "wait" : "pointer" }}
              >
                {busy
                  ? "Please wait..."
                  : mode === "signup"
                    ? "Create account"
                    : mode === "reset"
                      ? "Send reset instructions"
                      : "Sign in"}
              </button>
            </form>

            {message && (
              <p role="status" aria-live="polite" style={{ marginTop: 16 }}>
                {message}
              </p>
            )}

            <div className="actions" style={{ marginTop: 20 }}>
              {mode !== "signin" && (
                <button type="button" className="btn" onClick={() => {
                  setMode("signin");
                  setMessage("");
                }}>
                  Back to sign in
                </button>
              )}
              {mode === "signin" && (
                <>
                  <button type="button" className="btn" onClick={() => {
                    setMode("signup");
                    setMessage("");
                  }}>
                    Create account
                  </button>
                  <button type="button" className="btn" onClick={() => {
                    setMode("reset");
                    setMessage("");
                  }}>
                    Forgot password?
                  </button>
                </>
              )}
            </div>

            <p style={{ marginTop: 20 }}>
              <Link href="/hub">Continue to public hub</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
