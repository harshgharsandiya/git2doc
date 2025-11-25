# NextAuth

This repository provides a complete, production-ready authentication solution built on the Next.js 14 App Router and NextAuth.js v5 (Auth.js). It leverages Next.js Server Actions for secure, efficient data mutations and integrates a PostgreSQL database via Prisma.

The architecture is designed for high security and flexibility, offering multiple authentication methods, advanced user management features like Two-Factor Authentication (2FA), and granular Role-Based Access Control (RBAC).

## ✨ Key Features

### Authentication & Security
*   **Credentials Flow:** Secure login and registration using email and password, with password hashing via `bcrypt`.
*   **OAuth Integration:** Supports seamless sign-in using external providers (Google and GitHub).
*   **Email Verification:** Mandatory email confirmation for new user accounts using time-limited tokens.
*   **Password Management:** Secure password reset flow initiated via email link and token validation.
*   **Two-Factor Authentication (2FA):** Optional, email-based 2FA for an enhanced layer of security during login.
*   **Account Linking Prevention:** Handles scenarios where a user attempts to log in with credentials when their email is already associated with an OAuth provider.

### Access Control & User Management
*   **Role-Based Access Control (RBAC):** Defines distinct `ADMIN` and `USER` roles.
*   **Protected Routes:** Implements server-side and client-side protection for routes based on authentication status and user role.
*   **`RoleGate` Component:** A client component (`nextauth/components/auth/role-gate.tsx`) used to conditionally render content based on the current user's role.
*   **Comprehensive Settings:** Allows authenticated users to update their profile details (name, email, password) and manage security settings (2FA toggle).

### Technical Implementation
*   **Server Actions:** All authentication mutations (login, register, reset, verification) are handled securely using Next.js Server Actions (`nextauth/actions/*`).
*   **Data Validation:** Uses Zod for robust schema validation across all forms and server actions.
*   **Session Management:** Efficient session handling, including optimistic UI updates and custom hooks (`useCurrentUser`, `useCurrentRole`).

## 🏗 Architecture and Logic Flow

The application follows a modern Next.js App Router structure, separating concerns between client-side forms and server-side business logic.

1.  **Client Forms (`nextauth/components/auth/*`):** Components like `LoginForm`, `RegisterForm`, and `ResetForm` handle user input, client-side validation (using Zod and `react-hook-form`), and manage UI state (loading, errors, success messages).
2.  **Server Actions (`nextauth/actions/*`):** These files contain the core authentication logic. They are responsible for:
    *   Interacting with the database (Prisma).
    *   Hashing passwords (`bcrypt`).
    *   Generating and validating security tokens (verification, password reset, 2FA).
    *   Sending emails (`sendVerificationEmail`, `sendPasswordResetEmail`).
    *   Calling the core `signIn` and `signOut` functions from NextAuth.js.
3.  **Protected Content:**
    *   Server-side protection is demonstrated in `nextauth/app/(protected)/server/page.tsx` by fetching session data using `currentUser()`.
    *   Client-side RBAC is enforced using the `RoleGate` component, which checks the user's role against a list of allowed roles before rendering its children.
4.  **Flow Examples:**
    *   **Login Flow (`nextauth/actions/login.ts`):** Checks credentials, then checks if 2FA is enabled. If 2FA is required, it returns `{ twoFactor: true }`, prompting the client form (`LoginForm`) to switch to the code input state. If a code is provided, it validates the code and confirms 2FA before finalizing the session.
    *   **Registration Flow (`nextauth/actions/register.ts`):** Creates the user, hashes the password, and immediately triggers the generation and sending of a verification email.

## 🛠 Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Authentication:** NextAuth.js v5 (Auth.js)
*   **Database/ORM:** PostgreSQL / Prisma
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Validation:** Zod
*   **Email Service:** NodeMailer

## ⚙️ Environment Configuration

The application requires the following environment variables to be set in a `.env` file:

| Variable | Purpose |
| :--- | :--- |
| `DATABASE_URL` | Connection string for the PostgreSQL database. |
| `AUTH_SECRET` | A long, random string used by NextAuth.js for signing cookies and tokens. |
| `GITHUB_CLIENT_ID` | Client ID for GitHub OAuth provider. |
| `GITHUB_CLIENT_SECRET` | Client Secret for GitHub OAuth provider. |
| `GOOGLE_CLIENT_ID` | Client ID for Google OAuth provider. |
| `GOOGLE_CLIENT_SECRET` | Client Secret for Google OAuth provider. |
| `GMAIL_EMAIL` | Email address used for sending verification and reset emails. |
| `GMAIL_APP_PASSWORD` | Application-specific password for the Gmail account. |
| `NEXT_PUBLIC_APP_URL` | The public URL of the application (e.g., `http://localhost:3000`). |

## 🚀 Getting Started

To run this project locally, ensure you have Node.js, npm, and a PostgreSQL database instance available.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/harshgharsandiya/NextAuth.git
    cd NextAuth/nextauth
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Database Setup:**
    Ensure your `.env` file is configured with `DATABASE_URL`. Then, apply the Prisma schema:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be accessible at `http://localhost:3000`.