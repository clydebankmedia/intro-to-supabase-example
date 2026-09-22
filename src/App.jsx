import { useEffect, useState } from "react";
import Login from "./Login.jsx";
import EntryForm from "./EntryForm.jsx";
import EntryList from "./EntryList.jsx";

// ============================================================
// TODO 2: Listen for auth state changes
// ------------------------------------------------------------
// Step 1: Import the Supabase client at the top of this file:
//
//     import { supabase } from "./supabaseClient";
//
// Step 2: Fill in the useEffect inside App (see the TODO there).
//
// What this teaches: auth listeners and React useEffect cleanup.
// Supabase tells your app whenever someone signs in or out, and
// your app keeps the current user in React state.
// ============================================================

export default function App() {
  // The signed-in user, or null when nobody is signed in.
  const [user, setUser] = useState(null);

  useEffect(() => {
    // TODO 2: Keep `user` in sync with Supabase Auth.
    //
    // 1. Subscribe to auth changes:
    //
    //     const { data: { subscription } } = supabase.auth.onAuthStateChange(
    //       (event, session) => {
    //         // session is null when the user is logged out
    //       }
    //     );
    //
    // 2. Inside the callback, set the user:
    //      - logged in  -> setUser(session.user)
    //      - logged out -> setUser(null)
    //    Hint: setUser(session?.user ?? null) handles both cases.
    //
    // 3. Return a cleanup function so the listener is removed when the
    //    component unmounts:
    //
    //     return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    // Uses the supabase import you add in TODO 2.
    // onAuthStateChange will fire and set user back to null.
    await supabase.auth.signOut();
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🐱 Cat Journal</h1>
        {user && (
          <div className="user-bar">
            <span>{user.email}</span>
            <button className="secondary" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        )}
      </header>

      {user ? (
        <>
          <EntryForm user={user} />
          <EntryList />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}
