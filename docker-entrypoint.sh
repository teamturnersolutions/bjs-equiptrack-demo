#!/bin/sh
set -e

echo "Starting EquipTrack Production Container..."

# Run Prisma database push and seeding on startup using the correct version
echo "Ensuring database schema is up-to-date..."
npx prisma@6.19.2 db push --accept-data-loss

echo "Seeding default data (roles, permissions, admin user)..."
node prisma/seed.js

echo "Handing over execution to nextjs user..."
exec su-exec nextjs "$@"
