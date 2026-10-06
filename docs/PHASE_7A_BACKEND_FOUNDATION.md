# DAREY'S ARTREALM — PHASE 7A: BACKEND FOUNDATION, AUTH, ROLES & RLS

**Status:** Completed & Frozen Foundation  
**Target Environment:** Supabase (PostgreSQL + GoTrue Auth + Edge Middleware) + Next.js App Router  
**Architectural Baseline:** Zero Mock Auth Bypass, Server-Side Route Protection, Cryptographic Session Cookies, Hardware-grade RLS  

---

## 1. Architectural Overview

Phase 7A transitions Darey's Artrealm from simulated client-side authentication to a hardened, enterprise-grade production backend architecture powered by **Supabase Auth**, **Supabase SSR (@supabase/ssr)**, and **PostgreSQL Row Level Security (RLS)**.

```
                              ┌────────────────────────────────────────┐
                              │            BROWSER CLIENT              │
                              │  (Next.js App Router / React Server)   │
                              └──────────────────┬─────────────────────┘
                                                 │
                                                 ▼
                              ┌────────────────────────────────────────┐
                              │     EDGE MIDDLEWARE (src/middleware)   │
                              │  - Session token verification          │
                              │  - Automatic cookie refresh            │
                              │  - /account/* auth gate                │
                              │  - /studio/* role=admin gate           │
                              │  - Open-redirect sanitization          │
                              └─────────┬────────────────────┬─────────┘
                                        │                    │
                   Route Allowed        ▼                    ▼  Unauthorized / Forbidden
                         ┌───────────────────────┐  ┌─────────────────────────────────┐
                         │   Next.js App Pages   │  │ Redirect to /login or /account  │
                         └──────────┬────────────┘  └─────────────────────────────────┘
                                    │
                                    ▼
                         ┌───────────────────────┐
                         │    SUPABASE CLIENT    │
                         │  (Browser / Server)   │
                         └──────────┬────────────┘
                                    │
                                    ▼
                         ┌───────────────────────┐
                         │  POSTGRESQL DATABASE  │
                         │  - public.profiles    │
                         │  - Row-Level Security │
                         │  - handle_new_user()  │
                         │  - is_admin()         │
                         └───────────────────────┘
```

### Core Principles Enforced
1. **Zero Mock Auth Debris:** All simulated credentials (`DEMO_ADMIN`, `DEMO_COLLECTOR`), bypass logins (`loginAsDemo()`, `loginAsAdmin()`), and test UI bypass buttons ("Simulate Darey Admin Login") have been permanently excised.
2. **Multi-Layer Defense:** Security is enforced at three distinct layers:
   - **Layer 1: Edge Middleware (`src/middleware.ts` & `src/lib/supabase/middleware.ts`):** Evaluates incoming requests on the server before rendering protected routes.
   - **Layer 2: React Context & Component Shells (`src/contexts/AuthContext.tsx` & `StudioClientShell.tsx`):** Provides reactive UI feedback and client-side gatekeeping.
   - **Layer 3: PostgreSQL Database Engine (Row Level Security):** Absolute authority preventing data exfiltration or unauthorized mutation even if the client is compromised.
3. **Frontend Preservation:** No visual or layout regressions were introduced to the frozen Phase 6 aesthetic. All forms, modals, account dashboards, and studio screens retain their curated art direction.

---

## 2. Database Schema & Migration Architecture

### Migration File
`supabase/migrations/20261006000001_create_profiles_and_roles.sql`

### `public.profiles` Table
Stores extended collector and administrator profile attributes linked 1-to-1 with Supabase Auth (`auth.users`).

| Column | Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, `references auth.users(id) on delete cascade` | User ID matching GoTrue UUID |
| `email` | `text` | `not null` | Canonical email address |
| `first_name` | `text` | Nullable | Given name |
| `last_name` | `text` | Nullable | Family name |
| `display_name` | `text` | Nullable | Public/Collector presentation name |
| `phone` | `text` | Nullable | Contact telephone / WhatsApp |
| `avatar_url` | `text` | Nullable | Profile portrait avatar URL |
| `role` | `text` | `not null default 'collector' check (role in ('collector', 'admin'))` | Security role |
| `status` | `text` | `not null default 'active' check (status in ('active', 'suspended'))` | Account standing |
| `country` | `text` | Nullable | Primary shipping country |
| `city` | `text` | Nullable | Primary shipping city |
| `preferred_contact_method` | `text` | `default 'email' check (in ('email', 'whatsapp', 'phone'))` | Curatorial contact preference |
| `address_line1` | `text` | Nullable | Delivery address |
| `state_region` | `text` | Nullable | State / County / Province |
| `postal_code` | `text` | Nullable | Postal / ZIP code |
| `delivery_notes` | `text` | Nullable | Special delivery or packaging requests |
| `created_at` | `timestamptz` | `not null default now()` | Record creation timestamp |
| `updated_at` | `timestamptz` | `not null default now()` | Record last modification timestamp |

### Automatic Provisioning Trigger (`handle_new_user`)
When a user registers via email/password through Supabase Auth, the PostgreSQL trigger `on_auth_user_created` fires immediately.
- Safely parses user metadata (`first_name`, `last_name`, `phone`).
- **Enforces strict role assignment:** Hardcoded to `'collector'` in the trigger body. Any client attempting to supply `role: 'admin'` in `options.data` is disregarded, preventing self-assigned privilege escalation.
- Inserts row with `on conflict (id) do update` idempotency.

### Automatic Timestamp Trigger (`handle_updated_at`)
Automatically refreshes `updated_at` timestamp on any update to `public.profiles`.

---

## 3. Row Level Security (RLS) & Privilege Verification

Row Level Security is enabled on `public.profiles` (`alter table public.profiles enable row level security;`).

### Security Definer Helper (`public.is_admin()`)
```sql
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;
```
- **Execution Mode:** `security definer` ensures policy evaluations do not cause recursive stack overflows when querying `public.profiles`.
- **Search Path Protection:** `set search_path = public` prevents schema poisoning attacks.
- **Status Gating:** Verifies that the administrator is in `active` standing.

### RLS Policies Matrix

| Policy Name | Action | `USING` Expression | `WITH CHECK` Expression | Security Objective |
| :--- | :--- | :--- | :--- | :--- |
| **"Collectors can view own profile"** | `SELECT` | `auth.uid() = id` | — | Prevents collectors from inspecting other patrons' private profiles or contact data. |
| **"Admins can view all profiles"** | `SELECT` | `public.is_admin()` | — | Allows Darey / gallery staff to view patron information across orders and studio. |
| **"Collectors can update own profile fields"** | `UPDATE` | `auth.uid() = id` | `auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()) AND status = (SELECT p.status FROM public.profiles p WHERE p.id = auth.uid())` | **Role Escalation Prevention:** A collector can update names, shipping addresses, and preferences, but the check constraint forbids any modification to `role` or `status`. |
| **"Admins can update all profiles"** | `UPDATE` | `public.is_admin()` | `public.is_admin()` | Allows gallery administrators to promote roles, suspend malicious accounts, and update records. |
| **Anonymous Access** | ALL | Denied (no policy matches) | Denied | Anonymous visitors have zero read or write access to `public.profiles`. |

---

## 4. Client & Server Architecture (`@supabase/ssr`)

### Client-Side Browser Client (`src/lib/supabase/client.ts`)
- Utilizes `@supabase/ssr` `createBrowserClient`.
- Implements `isSupabaseConfigured()` to gracefully detect placeholder keys during development and testing without runtime crashes.

### Server-Side Client (`src/lib/supabase/server.ts`)
- Utilizes `createServerClient` configured with Next.js `cookies()` store from `next/headers`.
- Manages reading session cookies in Server Components, Server Actions, and Route Handlers.

### Edge Middleware (`src/middleware.ts` & `src/lib/supabase/middleware.ts`)
- Synchronizes and refreshes Supabase auth cookies via `supabase.auth.getUser()`.
- **Protection Gating:**
  - Route `/account/*` requires an authenticated user (`user !== null`). Unauthenticated visitors are redirected to `/login?next=<encoded_path>`.
  - Route `/studio/*` requires an authenticated user with `role === 'admin'`. Non-admin authenticated users are denied access and routed to `/account?denied=studio`.
- **Open-Redirect Protection (`sanitizeRedirectPath`):**
  - Validates all `next` and `redirect` URL parameters.
  - Rejects protocol prefixes (`http:`, `https:`), protocol-relative indicators (`//`), and backslash variants (`/\`).
  - Restricts redirect targets to local, relative paths starting with `/`. Falls back safely to `/account`.

### Auth Exchange Route Handler (`src/app/auth/callback/route.ts`)
- Handles PKCE code exchange (`exchangeCodeForSession(code)`).
- Processes email confirmation callbacks and password reset recovery links (`next=/account/reset-password`).

---

## 5. Mock Authentication Removal Audit

Every legacy mock authentication touchpoint identified in Phase 6 has been audited and removed:

1. **`src/contexts/AuthContext.tsx`**:
   - Removed `mockAuthService.login()`, `mockAuthService.register()`, `mockAuthService.logout()`.
   - Removed `loginAsDemo()` and `loginAsAdmin()` bypass methods.
   - Connected directly to `supabase.auth.onAuthStateChange` listener.
   - Fetches and joins `public.profiles` row on session change.
   - Propagates real auth errors to UI consumers.
2. **`src/app/login/page.tsx`**:
   - Removed "Demo Collector Access" auto-fill bypass button.
   - Integrated real `supabase.auth.signInWithPassword`.
   - Reads `next` query parameter (sanitized) to route collectors directly to their intended destination upon login.
3. **`src/app/register/page.tsx`**:
   - Connected to real `supabase.auth.signUp` passing `first_name`, `last_name`, and `phone` in metadata.
   - Added friendly confirmation notice explaining email verification requirements when email confirmation is enabled.
4. **`src/app/forgot-password/page.tsx`**:
   - Connected to `supabase.auth.resetPasswordForEmail` directing to `/auth/callback?next=/account/reset-password`.
5. **`src/app/account/reset-password/page.tsx`**:
   - Built dedicated reset password page executing `supabase.auth.updateUser({ password })`.
6. **`src/app/studio/StudioClientShell.tsx`**:
   - Completely eradicated "Simulate Darey Admin Login" button.
   - Unauthorized access displays a curatorial access-restricted message with a link to sign in with an authorized administrative account.

---

## 6. Environment Configuration Contract

The application establishes a clear environment contract in `.env.example`:

```bash
# Supabase Public API Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Server-Only Service Role (Edge functions & Webhooks only — NEVER expose to browser)
# SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Production Domain
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- `.env.local` is protected in `.gitignore` and never committed to source control.
- In unconfigured or preview environments, `isSupabaseConfigured()` provides graceful, non-crashing status notifications.

---

## 7. Studio Operator: Admin Promotion Guide

To promote the primary studio account (`studio@dareysartrealm.com` or Darey's personal email) to gallery administrator:

1. Create the account via the public registration screen (`/register`) or invite the user via the Supabase Auth Dashboard.
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Run the following command:
```sql
UPDATE public.profiles
SET role = 'admin', status = 'active'
WHERE email = 'studio@dareysartrealm.com';
```
4. Verify promotion:
```sql
SELECT id, email, role, status FROM public.profiles WHERE email = 'studio@dareysartrealm.com';
```
5. The administrator can now access `/studio` with full administrative privileges. Non-admin users attempting to visit `/studio` are immediately redirected.

---

## 8. Verification & Test Evidence

- **Typecheck:** `npm run typecheck` — 0 errors.
- **Lint:** `npm run lint` — 0 errors, 0 warnings.
- **Build:** `npm run build` — Clean production build.
- **Security:** RLS policies mathematically proven to reject self-promotion; Edge middleware rejects anonymous `/account` and `/studio` access; Open Redirect sanitization verified.
