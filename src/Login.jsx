import { useState } from "react";
import { supabase } from "./supabaseClient";

// ============================================================
// TODO 1 (completed): Sign up and sign in with email + password
// ------------------------------------------------------------
// What this teaches: Supabase Authentication. Supabase stores
// users (in auth.users), checks passwords, and keeps the
// logged-in session in the browser for you.
// ============================================================

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignUp() {
    setErrorMessage("");

    // TODO 1a: Create a new account. With "Confirm email" turned off
    // in Supabase, this also signs the user in right away.
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setErrorMessage(error.message);
  }

  async function handleSignIn(event) {
    event.preventDefault(); // stop the page from reloading
    setErrorMessage("");

    // TODO 1b: Sign in to an existing account.
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErrorMessage(error.message);
  }

  return (
    <form className="card login" onSubmit={handleSignIn}>
      <p>Sign in to start writing about your cats.</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password (at least 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="login-buttons">
        <button type="submit">Sign in</button>
        <button type="button" className="secondary" onClick={handleSignUp}>
          Create account
        </button>
      </div>
    </form>
  );
}
