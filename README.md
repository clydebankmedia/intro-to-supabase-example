# 🐱 Cat Journal: Intro to Supabase

A hands-on beginner project. You'll build a small React app where people sign in with Google and write journal entries about their cats. Entries are saved in a Supabase PostgreSQL database and show up for everyone **in real time**, with no page refresh.

Most of the app is already built. Your job is to finish **4 TODOs**, and each one teaches a core Supabase concept.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (check with `node -v`)
- A free [Supabase](https://supabase.com/) account
- A Google account (for setting up Google sign-in)

## Supabase setup

### 1. Create a new Supabase project

1. Go to the [Supabase dashboard](https://supabase.com/dashboard) and click **New project**.
2. Give it a name (e.g. `cat-journal`), set a database password, and pick a region near you.
3. Wait a minute or two while the project starts up.

### 2. Create the `entries` table

Open **SQL Editor** in the sidebar, paste this, and click **Run**:

```sql
create table public.entries (
  id uuid primary key default gen_random_uuid(),
  title text,
  text text,
  user_id uuid references auth.users,
  created_at timestamptz default now()
);
```

| Column       | Type        | Notes                                      |
| ------------ | ----------- | ------------------------------------------ |
| `id`         | uuid        | Primary key, generated automatically       |
| `title`      | text        | The entry's title                          |
| `text`       | text        | The entry's body                           |
| `user_id`    | uuid        | Who wrote it (links to `auth.users`)       |
| `created_at` | timestamptz | When it was written, set automatically     |

### 3. Set up Row Level Security (RLS)

RLS decides who can read and write each row. Without policies, nobody can read or write anything through the API. Run this in the SQL Editor:

```sql
-- Turn on RLS for the table
alter table public.entries enable row level security;

-- Signed-in users can read all entries
create policy "Users can read all entries"
  on public.entries for select
  to authenticated
  using (true);

-- Signed-in users can only insert entries with their own user_id
create policy "Users can insert their own entries"
  on public.entries for insert
  to authenticated
  with check (auth.uid() = user_id);
```

### 4. Enable Realtime on the `entries` table

Run this in the SQL Editor:

```sql
alter publication supabase_realtime add table public.entries;
```

(You can also do this in the dashboard: open the table in **Table Editor** and turn on **Realtime**.)

### 5. Enable Google sign-in

Google sign-in has two halves: a Google Cloud OAuth client, and the Supabase provider settings.

**In Supabase:**

1. Go to **Authentication > Providers** (called **Sign In / Providers** in newer dashboards) and open **Google**.
2. Copy the **Callback URL** shown there. It looks like `https://<your-project-ref>.supabase.co/auth/v1/callback`.

**In Google Cloud Console:**

1. Go to [console.cloud.google.com](https://console.cloud.google.com/) and create (or pick) a project.
2. Set up the **OAuth consent screen** (External is fine for testing; add your own email as a test user).
3. Go to **APIs & Services > Credentials > Create credentials > OAuth client ID**.
4. Choose **Web application**.
5. Under **Authorized redirect URIs**, paste the Supabase Callback URL from above.
6. Click **Create** and copy the **Client ID** and **Client Secret**.

**Back in Supabase:**

1. Paste the Client ID and Client Secret into the Google provider settings, turn it **on**, and save.
2. Go to **Authentication > URL Configuration** and set **Site URL** to `http://localhost:5173`. This is where users are sent back after signing in.

### 6. Get your project URL and anon key

1. Go to **Settings > API** (called **Project Settings > API Keys** in newer dashboards).
2. Copy your **Project URL** and your **anon / public** key.
   - Newer projects may show a **publishable** key (`sb_publishable_...`) instead. That works in the same place.
   - **Never** use the `service_role` / secret key in a frontend app.
3. Open the `.env` file in this project and fill them in:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

The anon key is meant to be public. RLS (step 3) is what actually protects your data.

## Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

At first you'll see a **Sign in with Google** button that does nothing. That's expected! Work through the TODOs in order. After each one, save the file and the browser updates automatically.

> If you change `.env`, stop the dev server (Ctrl+C) and run `npm run dev` again. Vite only reads `.env` on startup.

## Project structure

```
src/
  supabaseClient.js  // Creates the Supabase client (done for you)
  App.jsx            // Main component, tracks who is signed in   (TODO 2)
  Login.jsx          // Google sign-in button                     (TODO 1)
  EntryForm.jsx      // Form to add a new journal entry           (TODO 3)
  EntryList.jsx      // Shows all entries in real time            (TODO 4)
  main.jsx           // Entry point
  App.css            // Basic styling
```

## The 4 TODOs

Each TODO has detailed comments in its file, including the exact code to write.

### TODO 1: Sign in with Google (`Login.jsx`)

Import `supabase` and call `supabase.auth.signInWithOAuth({ provider: "google" })` when the button is clicked.

**What it teaches:** Supabase Authentication and OAuth providers. Supabase handles the redirect to Google and back, and stores the session in the browser for you.

**Check it:** clicking the button takes you to Google. After you sign in you land back on the app, but it still shows the sign-in button. That's because the app isn't listening for the login yet, which is TODO 2.

### TODO 2: Listen for auth state changes (`App.jsx`)

Import `supabase`, then inside the `useEffect` call `supabase.auth.onAuthStateChange(callback)`. Set `user` to `session.user` when logged in and `null` when logged out. Return a cleanup function that calls `subscription.unsubscribe()`.

**What it teaches:** auth listeners, and why React `useEffect` needs a cleanup function (so listeners don't pile up or leak).

**Check it:** after signing in you see your email, a Sign out button, and the entry form. Sign out works too.

### TODO 3: Insert a row into the database (`EntryForm.jsx`)

Import `supabase` and, on submit, call `supabase.from("entries").insert([{ title, text, user_id: user.id }])`. The `user` comes in as a prop from `App.jsx`.

**What it teaches:** writing to Supabase. Each object becomes one row, and its keys must match column names. The RLS policy checks that `user_id` matches the signed-in user, so try putting a different ID there and watch it fail.

**Check it:** submit an entry, then open **Table Editor > entries** in Supabase and see your row. It won't appear in the app yet, which is TODO 4.

### TODO 4: Subscribe to real-time changes (`EntryList.jsx`)

Import `supabase` and, inside the `useEffect`:

1. Fetch existing entries with `supabase.from("entries").select("*").order("created_at", { ascending: false })`.
2. Subscribe to inserts with `supabase.channel("entries-changes").on("postgres_changes", { event: "INSERT", schema: "public", table: "entries" }, callback).subscribe()`.
3. In the callback, add `payload.new` to the top of the list.
4. Return a cleanup function that calls `supabase.removeChannel(channel)`.

**What it teaches:** real-time subscriptions, Supabase channels, PostgreSQL change events, and cleaning up subscriptions.

**Check it:** open the app in two browser windows side by side. Add an entry in one and watch it appear in the other instantly.

## Troubleshooting

- **Blank page or "supabaseUrl is required"**: `.env` isn't filled in, or you didn't restart `npm run dev` after editing it.
- **Google says `redirect_uri_mismatch`**: the redirect URI in Google Cloud must exactly match the Supabase Callback URL.
- **After Google sign-in you land on the wrong URL**: check **Site URL** in Authentication > URL Configuration.
- **Insert fails with "new row violates row-level security policy"**: `user_id` doesn't match the signed-in user, or the insert policy is missing.
- **Entries save but don't appear live**: Realtime isn't enabled on the table (step 4), or the select policy is missing. Realtime respects RLS too.
