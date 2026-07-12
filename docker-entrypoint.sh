#!/bin/sh
set -e

echo "Starting EquipTrack Production Container..."

# Run Prisma database push and seeding on startup using the local package binary
echo "Ensuring database schema is up-to-date..."
npx --no-install prisma db push --accept-data-loss

echo "Seeding default data (roles, permissions, admin user)..."
node prisma/seed.js

echo "Handing over execution to nextjs user..."
exec su-exec nextjs "$@"
