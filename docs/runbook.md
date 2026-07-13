# IT Infrastructure Runbook for EquipTrack

## 1. Prerequisites
- **Host Server**: A Linux host (e.g., Ubuntu 24.04) or Windows host (WSL2/Hyper-V) with at least 2 CPU cores and 4GB RAM.
- **Docker**: Docker Engine and Docker Compose installed.
- **Network**: Port `9002` exposed, or reverse proxy routing traffic from `443` (HTTPS) to `9002`.

## 2. Deployment Instructions
1. **Clone Repository**: Clone the production branch of EquipTrack onto the host.
2. **Environment Variables**: Create a `.env` file in the project root:
   ```env
   # PostgreSQL Connection URL (points to the container network)
   DATABASE_URL="postgresql://postgres:equiptrack@equiptrack-db:5432/equiptrack_db?schema=public"
   
   # NextAuth Security Secret (Generate with `openssl rand -base64 32`)
   AUTH_SECRET="<YOUR_BASE64_SECRET>"
   
   # App URL (Must match the public URL)
   NEXT_PUBLIC_APP_URL="https://equiptrack.company.com"
   ```
3. **Build and Run**:
   ```bash
   docker compose up -d --build
   ```
4. **Verification**: Access the server at `http://<IP>:9002` and ensure the dashboard loads successfully.

## 3. Database Management & Backups
The database runs as a Docker container (`equiptrack-db`) with a persistent volume (`pgdata`).

**To perform a manual backup**:
```bash
docker exec -t equiptrack-db pg_dump -U postgres equiptrack_db > backup_$(date +%Y%m%d).sql
```

**To restore from a backup**:
```bash
cat backup_file.sql | docker exec -i equiptrack-db psql -U postgres -d equiptrack_db
```

## 4. Disaster Recovery
If the server fails completely, you can restore service on a new host by:
1. Re-running the deployment instructions on the new host.
2. Restoring the SQL dump into the fresh PostgreSQL container using the restore command above.
3. Updating DNS records to point to the new host.
