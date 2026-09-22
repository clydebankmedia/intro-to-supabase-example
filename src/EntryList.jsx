import { useEffect, useState } from "react";

// ============================================================
// TODO 4: Subscribe to real-time changes
// ------------------------------------------------------------
// Step 1: Import the Supabase client at the top of this file:
//
//     import { supabase } from "./supabaseClient";
//
// Step 2: Fill in the useEffect below (see the TODO inside it).
//
// What this teaches: real-time subscriptions, Supabase channels,
// PostgreSQL change events, and cleaning up subscriptions.
// ============================================================

export default function EntryList() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // TODO 4: Load existing entries, then listen for new ones.
    //
    // 1. Fetch the entries that already exist, newest first:
    //
    //     async function loadEntries() {
    //       const { data, error } = await supabase
    //         .from("entries")
    //         .select("*")
    //         .order("created_at", { ascending: false });
    //       if (error) console.error(error);
    //       else setEntries(data);
    //     }
    //     loadEntries();
    //
    // 2. Subscribe to INSERT events on the entries table:
    //
    //     const channel = supabase
    //       .channel("entries-changes")
    //       .on(
    //         "postgres_changes",
    //         { event: "INSERT", schema: "public", table: "entries" },
    //         (payload) => {
    //           // payload.new is the row that was just inserted
    //         }
    //       )
    //       .subscribe();
    //
    // 3. In the callback, put the new row at the TOP of the list:
    //
    //     setEntries((current) => [payload.new, ...current]);
    //
    // 4. Return a cleanup function that removes the channel:
    //
    //     return () => {
    //       supabase.removeChannel(channel);
    //     };
  }, []);

  if (entries.length === 0) {
    return <p className="empty">No entries yet. Write the first one!</p>;
  }

  return (
    <div className="entry-list">
      {entries.map((entry) => (
        <div className="card entry" key={entry.id}>
          <h3>{entry.title}</h3>
          <p>{entry.text}</p>
          <small>{new Date(entry.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
