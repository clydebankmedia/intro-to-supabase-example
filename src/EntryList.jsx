import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// ============================================================
// TODO 4 (completed): Subscribe to real-time changes
// ------------------------------------------------------------
// What this teaches: real-time subscriptions, Supabase channels,
// PostgreSQL change events, and cleaning up subscriptions.
// ============================================================

export default function EntryList() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // 1. Load the entries that already exist, newest first.
    async function loadEntries() {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setEntries(data);
    }
    loadEntries();

    // 2. Listen for new rows inserted into the entries table.
    const channel = supabase
      .channel("entries-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "entries" },
        (payload) => {
          // 3. payload.new is the row that was just inserted.
          //    Put it at the top of the list.
          setEntries((current) => [payload.new, ...current]);
        }
      )
      .subscribe();

    // 4. Cleanup: remove the channel when the component unmounts.
    return () => {
      supabase.removeChannel(channel);
    };
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
