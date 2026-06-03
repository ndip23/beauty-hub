# Beauty Heaven

## Architecture Overview

BeautyHeaven is a full-stack platform for discovering salons and managing salon operations.

- **Client**: React app in `/client` (React Router, SWR for data fetching).
- **Server**: Express API in `/server` (MongoDB via Mongoose).
- **Auth & Roles**: JWT-based auth with roles `customer`, `salon_owner`, `admin`.
- **Payments**: Swychr (AccountPe) payment links + webhook + polling fallback.
- **Layouts**: Public pages use a shared header/footer; dashboards are role-protected.

### Key Flows

- **Subscription + Payment**  
  Users select a plan, then `/api/subscriptions/subscribe` creates a Subscription + Payment
  and opens the Swychr payment link. Status updates are handled via:
  - Webhook: `POST /api/payments/swychr/webhook`
  - Polling: `GET /api/payments/:id/check-payment-status`
  - Redirect: `GET /api/payments/swychr/webhook` → frontend `/payment`

- **Receipts + Invoices**  
  Completed payment records are stored as transactions and can generate PDF documents:
  - Receipt PDF: `GET /api/transactions/:id/receipt`
  - Invoice PDF: `GET /api/transactions/:id/invoice`
  - QR verification: `GET /api/transactions/:id/verify`

- **Supported currency (temporary)**  
  Payments currently accept **XAF only**. Plans must have `currency: "XAF"` until
  conversion is reintroduced.

### Frontend Routes (Public)

- `/` Home
- `/subscriptions` Pricing / Plans
- `/become-salon-owner`
- `/salons`, `/salon/:id`
- `/about`, `/tips`, `/contact`
- `/payment` Payment page (also handles redirect verification)

### Auth Routes

- `/login` Sign in
- `/register` Sign up

### Customer Dashboard (Protected)

- `/dashboard`
- `/favorites`
- `/compare`
- `/messages`
- `/settings`

### Salon Owner Dashboard (Protected)

- `/salon-owner/dashboard`
- `/salon-owner/appointments`
- `/salon-owner/profile`
- `/salon-owner/services`
- `/salon-owner/messages`
- `/salon-owner/reviews`
- `/salon-owner/analytics`
- `/salon-owner/settings`
- `/salon-owner/receipts`

### Admin Dashboard

- `/admin/overview`
- `/admin/users`
- `/admin/salons`
- `/admin/appointments`
- `/admin/subscriptions`
- `/admin/plans`
- `/admin/payments`
- `/admin/coupons`

## Seed a Default Admin (Development)

Run from `/server`:

```
npm run seed:admin
```

Defaults:
- Email: `admin@beautyheaven.local`
- Password: `Admin123!`

Optional overrides (in `server/.env`):
- `ADMIN_SEED_NAME`
- `ADMIN_SEED_EMAIL`
- `ADMIN_SEED_PASSWORD`
- `ADMIN_SEED_RESET_PASSWORD=true` (force reset password if admin exists)

## Required environment variables

### Server (`/server/.env`)
- `MONGO_URI` (required): MongoDB connection string
- `JWT_SECRET` (required): JWT signing secret
- `FRONTEND_URL` (required): Base URL used in email verification links
- `EMAIL_USER` (required in production): Gmail address for Nodemailer
- `EMAIL_PASS` (required in production): Gmail app password for Nodemailer
- `SWYCHR_EMAIL` (required for payments): Swychr login email
- `SWYCHR_PASSWORD` (required for payments): Swychr login password
- `SWYCHR_WEBHOOK_SECRET` (optional): HMAC secret for verifying webhook signatures

Optional:
- `SWYCHR_CALLBACK_URL` (optional): Fallback webhook URL if request-based callback cannot be built
- `PORT` (defaults to 5000)
- `NODE_ENV` (e.g., `development` or `production`)

### Client (`/client/.env`)
- `REACT_APP_API_URL` (optional): API base URL (defaults to `http://localhost:5000`)

Optional:
- `PORT` (defaults to 3000 for the static server in `client/server.js`)
