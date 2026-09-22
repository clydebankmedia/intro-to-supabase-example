# 🐱 Cat Journal: Intro to Supabase

A hands-on beginner project. You'll build a small React app where people sign in with an email and password and write journal entries about their cats. Entries are saved in a Supabase PostgreSQL database and show up for everyone **in real time**, with no page refresh.

Most of the app is already built. Your job is to finish **4 TODOs**, and each one teaches a core Supabase concept.

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (check with `node -v`)
- A free [Supabase](https://supabase.com/) account

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

### 5. Set up email/password sign-in

Email sign-in is turned on by default in new Supabase projects. You only need to change one setting:

1. Go to **Authentication > Providers** (called **Sign In / Providers** in newer dashboards) and open **Email**.
2. Make sure **Enable Email provider** is on.
3. Turn **off** **Confirm email**, then save.

Why turn off confirmation? By default Supabase emails new users a link they must click before they can sign in, and Supabase's built-in email sender only allows a few emails per hour. With confirmation off, creating an account signs you in right away. (For a real app you'd leave it on and set up your own email provider.)

### 6. Get your project URL and publishable key

1. **Project URL:** go to **Project Settings > Data API** (or click **Connect** at the top of the dashboard). It looks like `https://<your-project-ref>.supabase.co`.
2. **Publishable key:** go to **Project Settings > API Keys** and copy the **default** publishable key. It starts with `sb_publishable_`.
   - Older projects may only show a legacy **anon** key (a long string starting with `eyJ`). That works in the same place.
   - **Never** use a **secret** key (`sb_secret_...`) or the legacy `service_role` key in a frontend app. Those skip RLS entirely.
3. Make your own `.env` file by copying the example:

```bash
cp .env.example .env
```

4. Open `.env` and fill in your values:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your-key-here
```

The publishable key is meant to be public, since it ends up in the browser anyway. RLS (step 3) is what actually protects your data.

`.env` is listed in `.gitignore`, so it never gets committed. `.env.example` is committed so everyone knows which variables to set. Even though the publishable key isn't secret, keeping config out of git is a good habit. Real projects usually have secret keys in there too.

## Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

At first you'll see a sign-in form whose buttons do nothing. That's expected! Work through the TODOs in order. After each one, save the file and the browser updates automatically.

> If you change `.env`, stop the dev server (Ctrl+C) and run `npm run dev` again. Vite only reads `.env` on startup.

## Project structure

```
src/
  supabaseClient.js  // Creates the Supabase client (done for you)
  App.jsx            // Main component, tracks who is signed in   (TODO 2)
  Login.jsx          // Email/password sign-in form               (TODO 1)
  EntryForm.jsx      // Form to add a new journal entry           (TODO 3)
  EntryList.jsx      // Shows all entries in real time            (TODO 4)
  main.jsx           // Entry point
  App.css            // Basic styling
```

## The 4 TODOs

Each TODO has detailed comments in its file, including the exact code to write.

### TODO 1: Sign up and sign in with email + password (`Login.jsx`)

Import `supabase`, then:

- In `handleSignUp`, call `supabase.auth.signUp({ email, password })`.
- In `handleSignIn`, call `supabase.auth.signInWithPassword({ email, password })`.

**What it teaches:** Supabase Authentication. Supabase stores your users, checks passwords, and keeps the session in the browser for you.

**Check it:** create an account, then look in **Authentication > Users** in Supabase and find your new user. The app still shows the sign-in form. That's because it isn't listening for the login yet, which is TODO 2.

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

- **Blank page or "supabaseUrl is required"**: `.env` is missing (did you copy `.env.example`?), isn't filled in, or you didn't restart `npm run dev` after editing it.
- **"Email not confirmed" when signing in**: turn off **Confirm email** (setup step 5), then delete that user in **Authentication > Users** and sign up again.
- **"Email rate limit exceeded"**: Supabase's built-in email sender is limited. Turn off **Confirm email** so no emails are sent.
- **"Password should be at least 6 characters"**: that's Supabase's default minimum password length.
- **Insert fails with "new row violates row-level security policy"**: `user_id` doesn't match the signed-in user, or the insert policy is missing.
- **Entries save but don't appear live**: Realtime isn't enabled on the table (step 4), or the select policy is missing. Realtime respects RLS too.
