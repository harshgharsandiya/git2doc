# RepoDocify (git2doc)

A lightweight tool that generates clean documentation (README.md) from any public GitHub repository URL.

## Features

-   Accepts any public GitHub URL
-   Fetches repository metadata & file structure
-   Generates a clean README.md

## TechStack

-   Frontend: Nextjs
-   Backend: Nodejs, Express
-   LLM: Groq SDK

## How It Works

1. User enters a GitHub repo URL
2. Frontend sends it to backend
3. Backend fetches repo metadata + file tree
4. Backend sends data to LLM
5. LLM generates a clean README.md
6. Frontend displays the generated result
