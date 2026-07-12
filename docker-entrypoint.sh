#!/bin/sh
set -e

# Initialize DB if volume is empty
if [ ! -f "$DATABASE_FILE" ]; then
  echo "Seeding database..."
  npx prisma db push --accept-data-loss 2>/dev/null
  node prisma/seed.cjs 2>/dev/null || true
  echo "Seed done"
fi

exec node build
