# Boxing Studio Platform 🥊

A secure and simple web platform for managing a boxing studio.
The focus is on **clarity, usability, and security**, not visual complexity.

The public website is intentionally minimal so that even children can understand it,
while the underlying infrastructure follows professional software engineering practices.

---

## Project Goals

- Extremely simple user interface
- Secure architecture
- No storage of sensitive personal or payment data
- Clear separation between public website and admin system
- Scalable roadmap from MVP to full management platform

---

## Architecture Overview

- **Public Website:** Static (HTML, CSS, minimal JavaScript)
- **Admin Panel:** JavaScript-based web application
- **Backend:** Managed services for authentication, database, and payments
- **Payments:** External payment provider (no card data stored)
- **Hosting:** HTTPS-only environment

---

## Roadmap

### Phase 1 – MVP (Public Website)
- Static pages (Home, Training, Prices, About, Contact)
- Booking inquiry form
- Mobile-first responsive design
- No authentication
- No backend server

### Phase 2 – Admin & Members
- Secure admin login
- Member management
- Payment status tracking
- Basic reports and dashboard
- Role-based access (Admin)

### Phase 3 – Advanced Features
- Multiple roles (Admin / Staff)
- Audit logs
- CSV / Excel export
- Automated backups
- Full payment integration

---

## Security Principles

- HTTPS enforced
- No storage of:
  - ID documents
  - Credit card numbers
- Payments handled exclusively by payment providers
- No sensitive data stored on the platform
- All forms submit to external providers (no form data stored in the repo)
- Admin access protected by authentication and roles
- Principle of least privilege

---

## Deploying the Static Site (HTTPS)

This site is static and should be deployed on an HTTPS-only host.
Recommended options include **Netlify**, **Vercel**, or **GitHub Pages** (with HTTPS enabled).
Ensure your hosting provider enforces HTTPS for all traffic.

---

## Admin Panel (Phase 2 Setup)

The admin dashboard lives at `admin/index.html` and is designed to connect to
managed services (authentication + database). To enable Phase 2:

1. Create a Supabase project with a `members` table.
2. Add row-level security so only authenticated admins can read/write.
3. Replace the placeholder credentials in `admin/js/admin.js`:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Create at least one admin user in Supabase Auth.
5. Use the reference schema in `db/members_schema.sql` to create the table and policies.

The admin UI only tracks payment status (e.g., “Up to Date”) and never stores card data.

## Phase 2 – Admin & Members Management

Phase 2 requires a Supabase project and manual setup.

### Required setup steps
1. Create a Supabase project.
2. Enable Supabase Auth.
3. Apply the schema and RLS policies in `db/members_schema.sql` using the Supabase SQL editor.
4. Create an admin user in Supabase Auth.
5. Insert the admin user into the `profiles` table with role `admin`.
6. Create `admin/js/config.js` based on `config.ex.js` and provide:
   - Supabase project URL
   - Supabase publishable key

Without completing these steps, the admin UI will not function.

---

## Repository Structure (planned)
