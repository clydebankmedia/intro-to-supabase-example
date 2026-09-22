import { useState } from "react";

// ============================================================
// TODO 3: Insert a row into the database
// ------------------------------------------------------------
// Step 1: Import the Supabase client at the top of this file:
//
//     import { supabase } from "./supabaseClient";
//
// Step 2: Fill in handleSubmit below (see the TODO inside it).
//
// What this teaches: writing to Supabase. Each object you insert
// becomes one row in the `entries` table, and each key must match
// a column name (title, text, user_id). id and created_at are
// filled in automatically by the database defaults.
// ============================================================

export default function EntryForm({ user }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault(); // stop the page from reloading
    if (!title.trim() || !text.trim()) return;

    setSaving(true);
    setErrorMessage("");

    // TODO 3: Save the new entry to the `entries` table.
    //
    // Call:
    //     const { error } = await supabase
    //       .from("entries")
    //       .insert([{ title, text, user_id: user.id }]);
    //
    // `user` is passed in as a prop from App.jsx, and user.id is the
    // signed-in user's ID. The RLS policy only allows the insert if
    // user_id matches the person who is signed in.
    //
    // Then handle a failure:
    //     if (error) {
    //       setErrorMessage(error.message);
    //       setSaving(false);
    //       return;
    //     }
    //
    // You don't need to add the entry to the list yourself.
    // EntryList will receive it in real time (TODO 4).

    setTitle("");
    setText("");
    setSaving(false);
  }

  return (
    <form className="card entry-form" onSubmit={handleSubmit}>
      <h2>New entry</h2>
      <input
        type="text"
        placeholder="Title (e.g. Marge knocked over a plant)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="What did your cat do today?"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {errorMessage && <p className="error">{errorMessage}</p>}
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Add entry"}
      </button>
    </form>
  );
}
