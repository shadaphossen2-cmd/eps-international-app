# EPS INTERNATIONAL — Free Cloud App (Starter)

## What this is
A responsive browser-based business records app using Firebase Authentication + Cloud Firestore. It supports shared sales, purchases, stock, expenses, employee and delivery records across signed-in devices.

## Free setup
1. Create a project at https://console.firebase.google.com/
2. In Project settings → General → Your apps, create a Web app and copy its Firebase config.
3. Replace the placeholder values in `app.js` (`firebaseConfig`) with your config.
4. In Firebase Authentication → Sign-in method, enable **Email/Password**.
5. In Firestore Database, create a database.
6. Open Firestore Rules and paste `firestore.rules` for a private test project.
7. Host the files on GitHub Pages (repository Settings → Pages → Deploy from a branch → main / root), or another static host.
8. Open the published site and create your account.

## Important security warning
The included rules are a starter for a single trusted organization: every authenticated account in this Firebase project can read, add, and delete all shared records. Do not publish account creation openly for a real company. Before using real business data, restrict who can create accounts and implement role-based rules (admin/staff) and organization-specific access. Never put private service-account keys in frontend code.

## Current limitations
- This is a starter/MVP, not a complete accounting or ERP product.
- Entries are shared in one business collection; no customer/supplier master records, payroll calculations, invoice PDF, permissions UI, or automated backups yet.
- Amounts and quantities are basic records, not audited financial statements.
- Use a test project and sample data first. Configure Firebase billing alerts and review current free-tier quotas.
