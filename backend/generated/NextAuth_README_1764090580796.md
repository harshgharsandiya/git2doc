# NextAuth

## Description

This repository provides a complete, robust authentication solution built on Next.js and NextAuth. It implements modern security practices, including credential and OAuth authentication, full email verification, password management flows, and integrated Two-Factor Authentication (2FA). The architecture leverages Next.js Server Actions and API Routes to enforce secure Role-Based Access Control (RBAC) across the application.

## Key Features

*   **Full Authentication Flow:** Supports both standard credential login/registration and OAuth providers (inferred).
*   **Email Verification:** Mandatory email verification upon registration and for sensitive updates (like changing the primary email address).
*   **Password Management:** Secure password reset functionality using time-bound tokens and bcrypt hashing for new password creation.
*   **Two-Factor Authentication (2FA):** Implementation of 2FA via email tokens for enhanced login security.
*   **Role-Based Access Control (RBAC):** Enforces access restrictions based on user roles (`UserRole.ADMIN` vs. `UserRole.USER`) across:
    *   Client Components (using `<RoleGate />`).
    *   Server Components.
    *   Next.js Server Actions (`actions/admin.ts`).
    *   Next.js API Routes (`api/admin/route.ts`).
*   **User Settings Management:** Allows authenticated users to update their name, change their password (requiring current password validation), update their email (triggering re-verification), and toggle 2FA status.
*   **Server Actions:** All core authentication and user modification logic is handled securely via Next.js Server Actions (`nextauth/actions/`).

## Logic Flow

The application follows a secure, server-centric authentication pattern:

1.  **Authentication Actions (`nextauth/actions/`)**: All state-changing operations (login, register, reset, settings update) are handled by dedicated Server Actions. These actions perform input validation (Zod), database interaction (Prisma), token generation, and email sending.
2.  **Session Management**: User session data is retrieved using server utilities (`currentUser`, `currentRole`) in Server Components (`/server`) or client hooks (`useCurrentUser`) in Client Components (`/client`).
3.  **Access Control**:
    *   The `/admin` route demonstrates RBAC by restricting content display via the `<RoleGate>` component and testing access to protected Server Actions and API Routes.
    *   The `admin.ts` Server Action and `api/admin/route.ts` API route explicitly check the user's role before allowing execution or access, returning 403 (Forbidden) if the role is insufficient.
4.  **Email Updates**: Changing a user's email address in `/settings` triggers a verification token generation and email send. The user must click the link, which directs them to `/auth/change-mail`, where the `changeEmail` Server Action validates the token and updates the user record.

## Environment Configuration

This project requires the following environment variables to be configured for database connectivity, NextAuth operation, and email services:

| Variable | Purpose |
| :--- | :--- |
| `DATABASE_URL` | Connection string for the Prisma database (e.g., PostgreSQL, MySQL). |
| `AUTH_SECRET` | A long, random string used to sign session cookies and JWTs. |
| `NEXTAUTH_URL` | The base URL of the application. |
| `RESEND_API_KEY` or `EMAIL_SERVER_*` | Configuration for the email service used to send verification, reset, and 2FA tokens. |
| `GITHUB_ID`, `GITHUB_SECRET`, etc. | Credentials for any configured OAuth providers. |

## Installation and Usage

To run this project locally, follow these standard steps:

1.  **Clone the repository:**
    ```bash
    git clone harshgharsandiya/NextAuth
    cd NextAuth/nextauth
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up the database:**
    Ensure your `DATABASE_URL` is configured, then run migrations:
    ```bash
    npx prisma migrate dev
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

The application will be accessible at `http://localhost:3000`.