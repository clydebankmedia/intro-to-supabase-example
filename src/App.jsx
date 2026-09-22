import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Login from "./Login.jsx";
import EntryForm from "./EntryForm.jsx";
import EntryList from "./EntryList.jsx";

// ============================================================
// TODO 2 (completed): Listen for auth state changes
// ------------------------------------------------------------
// What this teaches: auth listeners and React useEffect cleanup.
// Supabase tells your app whenever someone signs in or out, and
// your app keeps the current user in React state.
// ============================================================

export default function App() {
  // The signed-in user, or null when nobody is signed in.
  const [user, setUser] = useState(null);

  useEffect(() => {
    // TODO 2: Subscribe to auth changes. This also fires once right away
    // with the current session, so a page refresh keeps you signed in.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // session is null when the user is logged out.
      setUser(session?.user ?? null);
    });

    // Cleanup: stop listening when the component unmounts.
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
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
