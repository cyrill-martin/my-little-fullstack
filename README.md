# kmapper GmbH: My Little Fullstack

How to setup a new basic multilanguage project from scratch

- for local development and production deplyoment on an Ubuntu server
- based on Directus and Nuxt with SSR
  - with a lightweight sqlite3 database
  - incl. multilanguage label management in Directus
  - incl. preview mode in Directus
  - incl. visual editor in Directus

## Architecture

![Architecture of kmapper's little fullstack mapped out](architecture.png)

## Initial Dev Setup

### Prerequesites

- Ubuntu
- Access to GitHub repository
- Docker
- Docker Compose
- Node/npm

### Setup

1. Get template files from GitHub and create a new project directory/repository:
   - https://github.com/cyrill-martin/my-little-fullstack
1. Check https://hub.docker.com/r/directus/directus for latest Directus Docker image an consider changing the version in `docker-compose.yml`
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

1. Repeat the former step for the production environment by renaming `.env.prod.exmaple` to `.env.prod` and adding production variables
1. Add Directus directories for mounted Docker volumes with `mkdir -p directus/database directus/uploads directus/extensions`
1. Set the owner of these directories to UID 1000 (the Directus Docker user, usually the same as your local user) with `sudo chown -R 1000:1000 directus/`
1. Set the permissions of the Directus directories so that everyone can read with `sudo chmod -R 755 directus/`
1. Create a fresh `frontend` directory with a SSR Nuxt project with `npx nuxi init frontend`
   - Choose the minimal setup
   - Do not add a Git repository
   - do not install any of the official modules
   - `__frontend` contains the basic project already but I prefer to start fresh with currenct npm versions for all packages. Keep the `__frontend` directory to copy composables, etc. later.
1. Navigate into the `frontend` directory with `cd frontend`
1. Run `npm install`
1. Run `npm install @css-render/vue3-ssr` to handle SSR
1. Run `npm i --save-dev @types/node` so there will be less warnings in VSC
1. Run `npm install @directus/sdk` to communicate with Directus
1. Run `npm install @directus/visual-editing` for Directus' visual edior feature
1. Run `npm install @nuxtjs/i18n` to add default i18n support
1. Run `npm i -D naive-ui` to add NaiveUI
1. Make sure the fresh `frontend` directory contains the file as in `__frontend`, except `package.json`/`package-lock.json` and `README.md`:
   ```txt
   - Dockerfile.dev
   - nuxt.config.ts --> Check the actual PROD URL for the second frame-ancestors!!
   - ./app/*
   ```
1. Navigate back to the root with `cd ..`
1. Remove the `__frontend` directoy
1. Start everything up with `docker compose up -d`
1. Vist http://localhost:8055, log in with the credentials from your .env file, and set the owner
1. Copy the demo database schema into the container with `docker compose cp ./seed/schema.yaml directus:/directus/schema.yaml`
1. Apply the demo database schema with `docker compose exec directus npx directus schema apply /directus/schema.yaml`
1. Remove the file for tidiness with `docker compose exec directus rm /directus/schema.yaml`
1. Go to Directus (http://localhost:8055) and log in
1. Make sure the `datasets`, `labels`, `pages` collections as well as their hidden translation collections are publicly available (read access is enough)
1. Import the collections items from the `seed` directory in the following order:
   - languages
   - datasets
   - labels
   - pages
1. Remove the `seed` directory
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
1. Review the basic project files and Directus setup and start developing

## Prod Setup

### Prerequesites

- Access to GitHub repository
- Ubuntu server with SSH access

### Setup

1. SSH into the server
1. Update system with `sudo apt update && sudo apt upgrade -y`
1. Install Docker with:
   - `curl -fsSL https://get.docker.com | sudo sh`
   - `sudo usermod -aG docker $USER`
1. Install Docker Compose plugin with `sudo apt install docker-compose-plugin -y`
1. Log out and back in for group changes
   - Exit with `exit`
   - Reconnect by SSHing into the server
1. Install Nginx with `sudo apt install nginx -y`
1. Install Certbot with `sudo apt install certbot python3-certbot-nginx -y`
1. Configure firewall in this order:
   - `sudo ufw allow OpenSSH`
   - `sudo ufw allow 'Nginx Full'`
   - `sudo ufw enable`
1. Make sure these ports are open in your Cloud Service's firewall if there is one:
   - 80 (HTTP)
   - 443 (HTTPS)

### Initial Project Deployment

1. SSH into the server
1. Create a project directoy with: `sudo mkdir -p /opt/{{ project }}`
1. Add the correct permissions with `sudo chown $USER:$USER /opt/{{ project }}`
1. cd into the project with `cd /opt/{{ project }}`
1. Add a Git repository with `git init`
1. Add the remote with `git remote add origin https://github.com/{{ username }}/{{ project }}.git`
1. Set `git branch --set-upstream-to=origin/main main`
1. Pull files with `git pull origin main`
1. Create an .env file on the server with `nano /opt/{{ project }}/.env` and paste the prod variables
   - Ctrl + o
   - Enter
   - Ctrl + x
1. Create Directus directories with `mkdir -p directus/database directus/uploads directus/extensions`
1. Make sure you have a working database file on your server with correct data and credentials or start blank and add or import schema and data

### Build and Start Containers

1. SSH into the server
1. cd into project with `cd /opt/{{ project }}`
1. Log in to Docker with `docker login -u {{ username }}`
1. Build and start containers with `docker compose -f docker-compose.prod.yml up -d --build`

### Configure Nginx

1. Create an Nginx configuration file with `sudo nano /etc/nginx/sites-available/{{ project }}`:

   ```bash
    # /etc/nginx/sites-available/{{ project }}
    server {
        listen 80;
        listen [::]:80; # Delete this line if you don't use IPv6
        server_name {{ frontend domain }};

        location ^~ /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            proxy_pass http://127.0.0.1:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }

    server {
        listen 80;
        listen [::]:80; # Delete this line if you don't use IPv6
        server_name {{ directus domain }};

        location ^~ /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            proxy_pass http://127.0.0.1:8055;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;

            # Larger body size for Directus uploads
            client_max_body_size 100M;
        }
    }
   ```

   - Ctrl + o
   - Enter
   - Ctrl + x

1. Create the Certbot directory with `sudo mkdir -p /var/www/certbot`
1. Enable the site with these commands in this order:
   ```bash
   sudo ln -s /etc/nginx/sites-available/{{ project }} /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### SSL with Let's Encrypt

1. FIRST, point your DNS for the directus and frontend domain to your server's IP
   - A records for IPv4
   - AAAA records for IPv6, in case of IPv6
1. THEN, add Certbot with `sudo certbot --nginx -d {{ frontend domain }} -d {{ directus domain }}`

### Ongoing Deployment

#### Frontend

1. SSH into the server
1. `cd /opt/{{ project }}`
1. Pull lates code with `git pull`
1. Rebuild and restart the frontend container with `docker compose -f docker-compose.prod.yml up -d --build frontend`

#### Directus (config/extensions)

1. SSH into the server
1. `cd /opt/{{ project }}`
1. Pull lates code with `git pull`
1. Rebuild and restart the directus container with `docker compose -f docker-compose.prod.yml up -d --build directus`

#### Environment Variables

1. SSH into container
1. `cd /opt/{{ project }}`
1. Edit .env with `nano .env`
   - Ctrl + o
   - Enter
   - Ctrl + x
1. Restart affected container(s)

#### Database

Figure out your own workflows to handle database changes.
