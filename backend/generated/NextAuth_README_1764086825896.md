# NextAuth
NextAuth is a complete authentication system that handles user registration, login, password reset, and verification. It also implements role-based access control (RBAC) and two-factor authentication (2FA).

## Description
NextAuth is designed to provide a secure and robust authentication mechanism for web applications. It utilizes Next-Auth, a popular authentication library for Next.js, and integrates it with a Prisma database. The system allows users to register, log in, and manage their accounts, while also providing administrators with control over user roles and access.

## Key Features
* Implements RBAC with two roles: ADMIN and USER
* Handles JWT sessions for secure authentication
* Supports 2FA for added security
* Allows users to register, log in, and reset their passwords
* Provides email verification and password reset mechanisms
* Integrates with Google and GitHub OAuth providers

## Logic Flow
The application's logic flow is based on the Next-Auth library, which handles authentication and session management. The Prisma database is used to store user data, and the application's business logic is implemented in the `actions` and `lib` directories. The `pages` directory contains the application's routes, which are protected by authentication middleware.

## Environment
The application requires the following environment variables:
* `GOOGLE_CLIENT_ID`
* `GOOGLE_CLIENT_SECRET`
* `GITHUB_CLIENT_ID`
* `GITHUB_CLIENT_SECRET`
* `DATABASE_URL`

## Installation
To install and run the application, follow these steps:
```bash
npm install
npm run dev
```
This will start the development server, and the application will be available at `http://localhost:3000`.