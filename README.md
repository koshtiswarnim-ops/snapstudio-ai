# SnapStudio AI — One-Click E-Commerce Product Photography SaaS

> **USP: Turn ordinary product photos into professional e-commerce images in one click.**

SnapStudio AI is a production-quality, dark scientific-instrument styled web application built for online sellers on Amazon, Shopify, Flipkart, and D2C storefronts.

---

## 🎨 Visual Design System & Aesthetics

Adheres to a dark scientific-software design specification:
- **Ground**: `#06070A`, Secondary Ground: `#0B0D12`, Card Ground: `#0F121B`
- **Ink**: `#E6EAF0`, Secondary Ink: `#98A0AE`, Muted: `#666E7C`
- **Accents**: Cyan `#4FD8E8` (Primary USP & status LEDs), Violet `#8B6FE8` (Secondary category tag)
- **Hairlines**: `rgba(230, 234, 240, 0.11)`
- **Typography**: 'Manrope' 500-800 for headings (`letter-spacing: -0.035em to -0.04em`); 'Chivo Mono' 400-600 uppercase (`9.5-11px`, `letter-spacing: 0.07em-0.12em`) for labels, values, and status tags.
- **Hero Canvas**: HTML5 orbiting canvas particle field representing product tensor subjects, with reduced-motion static frame fallback.
- **Text Mechanics**: Masked line wipe reveals wiping up from behind overflow edges.
- **Layout**: Sticky stages, fanned cards with 900px perspective, and scroll-bound layered parallax (`overflow: clip` on stage).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React Icons, React Router v6, TanStack Query
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL + Row Level Security (RLS) policies
- **Backend Orchestration**: n8n Cloud Webhooks
- **AI Processing**: External AI Image Editing/Generation API (OpenAI / Replicate / Gemini via n8n)
- **Payments**: Razorpay SDK Integration
- **Hosting / Deployment**: Vercel

---

## 🚀 Architecture & High-Level Flow

```text
                    ┌──────────────────┐
                    │   React + Vite   │
                    │    Frontend      │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐   ┌───────────┐  ┌───────────┐
        │ Supabase │   │ n8n Cloud │  │ Razorpay  │
        │ Auth/DB  │   │ Workflow  │  │ Payments  │
        └──────────┘   └─────┬─────┘  └───────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │ AI Image API│
                       └─────────────┘
```

---

## 🛠️ Local Setup & Development

1. **Clone the repository and install dependencies**:
   ```bash
   cd snapstudio-ai
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
   VITE_N8N_WEBHOOK_URL=https://your-n8n.cloud.n8n.io/webhook/generate-product-image
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 🗄️ Supabase PostgreSQL Setup

Execute the provided SQL script located in [`supabase/schema.sql`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/snapstudio-ai/supabase/schema.sql) in your Supabase SQL Editor to initialize:
- `public.profiles`
- `public.credits`
- `public.generations`
- `public.payments`
- `public.subscriptions`
- Automatic user creation trigger on `auth.users`
- Row Level Security (RLS) policies for complete tenant isolation

---

## ⚡ n8n Cloud Workflows Setup

Import the exported JSON workflow files in your n8n Cloud workspace:
1. **AI Image Generation Workflow**: [`n8n/image_generation_workflow.json`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/snapstudio-ai/n8n/image_generation_workflow.json)
2. **Razorpay Webhook Workflow**: [`n8n/razorpay_webhook_workflow.json`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/snapstudio-ai/n8n/razorpay_webhook_workflow.json)

---

## 🌐 Production Deployment (Vercel)

1. Connect your GitHub repository to Vercel.
2. Set Build Command: `npm run build` and Output Directory: `dist`.
3. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_RAZORPAY_KEY_ID`, `VITE_N8N_WEBHOOK_URL`).
4. Deploy!
