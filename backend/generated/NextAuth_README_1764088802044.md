# NextAuth: Complete Authentication Solution

This project provides a comprehensive, production-ready authentication and authorization boilerplate built on Next.js 14 (App Router) and NextAuth (Auth.js). It implements a secure, full-featured system including email verification, password reset, two-factor authentication, and role-based access control, utilizing Next.js Server Actions for secure data mutations.

## Features

*   **Full Authentication Flow:** Secure implementation of Login, Registration, and Logout using NextAuth.
*   **OAuth Provider Support:** Integration for social logins (e.g., Google, GitHub).
*   **Email Verification:** Token-based verification flow for new user registration.
*   **Password Reset:** Secure token-based flow for resetting forgotten passwords.
*   **Two-Factor Authentication (2FA):** Implementation of 2FA for enhanced security.
*   **Role-Based Access Control (RBAC):** Protect routes and components based on user roles (`/admin` route protection, `RoleGate` component).
*   **User Settings Management:** Dedicated page for users to update profile information, change email, and manage 2FA settings.
*   **Next.js Server Actions:** Utilizes server actions (`nextauth/actions/`) for secure, type-safe backend mutations.
*   **Database Integration:** Persistence layer managed by Prisma ORM.
*   **Custom NextAuth Callbacks:** Extended session and JWT callbacks to include custom user data (e.g., role, 2FA status).
*   **Custom UI Components:** Built with Shadcn UI for a modern, accessible interface.

## Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Authentication:** NextAuth (Auth.js)
*   **Language:** TypeScript
*   **Database ORM:** Prisma
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn UI / Radix UI
*   **Validation:** Zod
*   **Utilities:** React, Server Actions

## Installation

To set up and run the project locally, execute the following shell commands:

```bash
git clone <repository-url> NextAuth
cd NextAuth/nextauth
npm install
```

**Note:** Before running, ensure you configure your environment variables by copying `nextauth/.env.sample` to `.env` and filling in the required database connection string, NextAuth secrets, and email/OAuth provider credentials.

```bash
# Generate the Prisma client and apply migrations
npx prisma generate
npx prisma db push

# Start the development server
npm run dev
```