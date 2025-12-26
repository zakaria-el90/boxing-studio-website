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

## Repository Structure (planned)
