// ============================================================
// TODO 1: Sign in with Google
// ------------------------------------------------------------
// Step 1: Import the Supabase client at the top of this file:
//
//     import { supabase } from "./supabaseClient";
//
// Step 2: Fill in handleLogin below (see the TODO inside it).
//
// What this teaches: Supabase Authentication and OAuth providers.
// Supabase sends the user to Google, Google sends them back to
// your app, and Supabase stores the logged-in session for you.
// ============================================================

export default function Login() {
  async function handleLogin() {
    // TODO 1: Start the Google sign-in flow.
    //
    // Call:
    //     await supabase.auth.signInWithOAuth({ provider: "google" });
    //
    // This redirects the browser to Google. After the user signs in,
    // they come back to this app already logged in.
    //
    // Bonus: the call returns { error }. If error is set, log it with
    // console.error(error) so you can see what went wrong.
  }

  return (
    <div className="card login">
      <p>Sign in to start writing about your cats.</p>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}
