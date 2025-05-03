# 🐾 Pet Pal QR Alert

Create scannable QR tags for your pets, show their profile to the finder, and instantly alert you with the pet’s last-seen location.

---

## Table of Contents
1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Project Structure](#project-structure)  
4. [Getting Started](#getting-started)  
5. [Supabase Setup](#supabase-setup)  
6. [Development Scripts](#development-scripts)  
7. [Production Build & Deployment](#production-build--deployment)  
8. [Contributing](#contributing)  
9. [License](#license)  

---

## Features <a id="features"></a>

| Category          | Details |
| ----------------- | ------- |
| **Pet profiles**  | Create, edit and store multiple pets per user (name, breed, photo, contact info). |
| **QR generation** | Each pet gets a unique QR code (`/pages/QRCode.tsx`) that encodes an immutable short URL. |
| **Finder view**   | Anyone scanning is routed to `/pages/Scan.tsx`, sees the pet’s public profile and “Contact owner” action. |
| **Owner alerts**  | On every scan we capture the finder’s geolocation (if allowed) and write an event row to `supabase.public.pet_scans`, which can trigger real-time email / SMS / push via Supabase functions. |
| **Auth**          | Email/password login & registration backed by Supabase Auth (see `src/contexts/AuthContext.tsx`). |
| **Dashboard**     | After login the owner lands on `/pages/Dashboard.tsx`, listing pets, recent scans and analytics charts (via Recharts). |
| **Responsive UI** | Built with **shadcn-ui**, Tailwind CSS, Radix primitives and TypeScript-strict React. |

---

## Tech Stack <a id="tech-stack"></a>

- **Frontend:** React 18, Vite, TypeScript  
- **Styling / UI:** Tailwind CSS, shadcn-ui, Radix UI primitives  
- **State / Data:** React-Query v5, Zod, React-Hook-Form  
- **Backend-as-a-Service:** Supabase (Auth + Postgres DB + Edge Functions + Storage)  
- **Misc Libs:** `qrcode`, `uuid`, `date-fns`, `lucide-react` icons, `recharts` for analytics charts 0

---

## Project Structure <a id="project-structure"></a>

pet-pal-qr-alert/ ├─ public/                # static assets ├─ src/ │  ├─ components/         # reusable UI primitives │  ├─ contexts/ │  │  └─ AuthContext.tsx  # Supabase auth logic │  ├─ integrations/ │  │  └─ supabase/        # Supabase client wrapper │  ├─ pages/              # React Router pages │  │  ├─ Index.tsx        # Landing / marketing page │  │  ├─ Register.tsx, Login.tsx │  │  ├─ Dashboard.tsx │  │  ├─ AddPet.tsx, EditPet.tsx, PetProfile.tsx │  │  ├─ QRCode.tsx       # download/print QR │  │  ├─ Scan.tsx         # public scan handler │  │  ├─ HowItWorks.tsx, Privacy.tsx │  │  └─ NotFound.tsx │  ├─ App.tsx             # Router & providers │  └─ types/              # Zod schemas & TS helpers ├─ supabase/ │  ├─ migrations/         # SQL for pets, pet_scans, profiles │  └─ .env.example        # copy → .env.local (see below) ├─ tailwind.config.ts ├─ vite.config.ts └─ README.md              # ← you are here

---

## Getting Started <a id="getting-started"></a>

### Prerequisites
| Tool           | Version (tested) | Notes |
| -------------- | ---------------- | ----- |
| Node           | **≥ 18 LTS**     | Use [nvm](https://github.com/nvm-sh/nvm) or `bun` if you prefer |
| npm / bun      | npm ≥ 10 or bun ≥ 1.1 | Project ships with both lockfiles (`package-lock.json`, `bun.lockb`) |
| Supabase CLI   | optional         | Helpful for local Postgres/emulators |

### Local install

```bash
# 1. Clone
git clone https://github.com/jbest88/pet-pal-qr-alert.git
cd pet-pal-qr-alert

# 2. Install deps
npm install        # or: bun install

# 3. Configure environment
cp supabase/.env.example .env.local
#   └─ fill in: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

# 4. Run dev server
npm run dev        # http://localhost:5173


---

Supabase Setup <a id="supabase-setup"></a>

1. Create a new project at https://supabase.com.


2. Copy your keys into .env.local

VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_public_anon_key


3. Run migrations (either in Dashboard SQL editor or with Supabase CLI):

-- profiles
create table profiles (
  id uuid primary key references auth.users(id),
  name text,
  phone text,
  created_at timestamptz default now()
);

-- pets
create table pets (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id),
  name text not null,
  breed text,
  photo_url text,
  created_at timestamptz default now()
);

-- scans
create table pet_scans (
  id uuid primary key default uuid_generate_v4(),
  pet_id uuid references pets(id),
  scanned_at timestamptz default now(),
  latitude numeric,
  longitude numeric
);


4. (Optional) Edge Function notify-owner.ts to send email/SMS on insert into pet_scans.




---

Development Scripts <a id="development-scripts"></a>

> Tip: If you use Bun, replace npm with bun run.




---

Production Build & Deployment <a id="production-build--deployment"></a>

1. Build the static site:

npm run build


2. Deploy dist/ to Vercel, Netlify, or Supabase Storage + Cloudflare R2.
Make sure the two environment variables are set in the hosting platform.


3. (Optional) Publish directly from Lovable.dev via Share → Publish (if you’re using the Lovable workflow). 