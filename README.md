# kmapper GmbH: My Little Fullstack

How to setup a new basic multilanguage project from scratch

- for local development and production deplyoment
- based on Directus and Nuxt with SSR
  - with a lightweight sqlite3 database
  - incl. multilanguage label management in Directus
  - incl. preview mode in Directus
  - incl. custom edit mode in Nuxt
    1. Ctrl + e
    1. Hover
    1. Right click

## Prerequesites

- GitHub account
- Docker installation
- Node/npm installation
- Ubuntu server
  - Docker
  - ...

## Initial Setup

1. Get template files from GitHub and create a new project directory/repository
   - https://github.com/cyrill-martin/my-little-fullstack
1. Check https://hub.docker.com/r/directus/directus for latest Directus Docker image an consider changing the version in `docker-compose.yml`.
1. Rename `.env.exmaple` to `.env` and add credentials for local development:

   ```bash
   # Directus configuration
   DIRECTUS_SECRET={{ your secrect }} # No $ signs
   DIRECTUS_ADMIN_EMAIL={{ your e-mail }}
   DIRECTUS_ADMIN_PASSWORD={{ your passowrd }} # No $ signs
   DIRECTUS_PUBLIC_URL=http://localhost:8055

   # Nuxt configuration
   NUXT_DIRECTUS_URL=http://directus:8055
   NUXT_PUBLIC_DIRECTUS_URL=http://localhost:8055

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

1. Repeat the former step for the production environment by renaming `.env.prod.exmaple` to `.env.prod` to keep production variables
1. Add Directus directories for mounted Docker volumes with `mkdir -p directus/database directus/uploads directus/extensions`
1. Set the owner of these directories to the Docker user with `sudo chown -R 1000:1000 directus/`
1. Set the permissions of the Directus directories so that everyone can read with `sudo chmod -R 755 directus/`
1. Create a fresh `frontend` directory with a SSR Nuxt project with `npx nuxi init frontend`
   - Choose the minimal setup
   - Do not add a Git repository
   - do not install any of the official modules
   - `__frontend` contains an according project already but I prefer to start fresh with currenct npm versions for all packages. Keep the `__frontend` directory to copy composables, etc. later.
1. Navigate into the `frontend` directory with `cd frontend`
1. Run `npm install`.
1. Run `npm install @css-render/vue3-ssr` to handle SSR
1. Run `npm i --save-dev @types/node` so there will be less warnings in VSC.
1. Run `npm install @directus/sdk` to communicate with Directus.
1. Run `npm install @nuxtjs/i18n` to add default i18n support.
1. Run `npm i -D naive-ui` to add NaiveUI.
1. Make sure the fresh `frontend` directory contains the file as in `__frontend`, except `package.json`/`package-lock.json` and `README.md`:
   ```txt
   - Dockerfile.dev
   - nuxt.config.ts
   - ./app/*
   ```
1. Navigate back to the root with `cd ..`.
1. Remove the `__frontend` directoy.
1. Start everything up with `docker compose up -d`:
1. Vist http://localhost:8055, log in with the credentials from your .env file, and set the owner.
1. Copy the demo database schema into the container with `docker compose cp ./seed/schema.yaml directus:/directus/schema.yaml`
1. Apply the demo database schema with `docker compose exec directus npx directus schema apply /directus/schema.yaml`
1. Remove the file for tidiness with `docker compose exec directus rm /directus/schema.yaml`.
1. Go to Directus (http://localhost:8055) and log in.
1. Make sure the `datasets`, `labels`, `pages` collections as well as their hidden translation collections are publicly available (read access is enough).
1. Import the collections items from the `seed` directory in the following order:
   - languages
   - datasets
   - labels
   - pages
1. Remove the `seed` directory.
1. Check http://localhost:3000 for the demo
1. Check `LICENSE.md`
1. Make sure `.gitignore` looks like this (WITHOUT ANY LEADING SPACES):

   ```git
   # Environment
   .env
   .env.local
   .env.*.local

   # Directus
   directus/database/
   directus/uploads/

   # Nuxt
   frontend/node_modules/
   frontend/.nuxt/
   frontend/.output/
   frontend/dist/

   # IDE
   .vscode/
   .idea/

   # OS
   .DS_Store
   ```

1. Add a proper Git repository with:
   ```git
   git init
   git add .gitignore
   git add .
   git commit -m "Initial commit"
   ```
