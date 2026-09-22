import { useState } from "react";

// ============================================================
// TODO 1: Sign up and sign in with email + password
// ------------------------------------------------------------
// Step 1: Import the Supabase client at the top of this file:
//
//     import { supabase } from "./supabaseClient";
//
// Step 2: Fill in handleSignUp and handleSignIn below
//         (see the TODOs inside them).
//
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

    // TODO 1a: Create a new account.
    //
    // Call:
    //     const { error } = await supabase.auth.signUp({ email, password });
    //
    // If something went wrong (e.g. password too short), show it:
    //     if (error) setErrorMessage(error.message);
    //
    // With "Confirm email" turned off in Supabase (see README), a
    // successful sign-up also signs the user in right away.
  }

  async function handleSignIn(event) {
    event.preventDefault(); // stop the page from reloading
    setErrorMessage("");

    // TODO 1b: Sign in to an existing account.
    //
    // Call:
    //     const { error } = await supabase.auth.signInWithPassword({ email, password });
    //
    // If the email or password is wrong, show it:
    //     if (error) setErrorMessage(error.message);
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
