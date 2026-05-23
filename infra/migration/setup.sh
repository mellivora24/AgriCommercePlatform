#!/usr/bin/env bash

set -e

echo "Kiểm tra môi trường phát triển..."
echo "Phiên bản NodeJS: $(node -v)"
echo "Phiên bản Docker: $(docker --version)"
echo "Kiểm tra Flutter: $(flutter --version)"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Tạo container PostgreSQL..."
cd "$ROOT_DIR/docker"
docker compose up -d

until docker exec postgres pg_isready -U postgres_user > /dev/null 2>&1
do
  sleep 1
done

echo "Bắt đầu migration database..."
for file in "$SCRIPT_DIR/postgres"/*.sql
do
  echo "Running: $(basename "$file")"
  docker exec -i postgres psql \
    -U postgres_user \
    -d tmdt_database \
    < "$file"
done
echo "Xong!"

cd "$ROOT_DIR/apps/backend"
echo "Cài đặt dependencies cho backend..."
npm install

echo "Gen prisma client..."
cd "$ROOT_DIR/apps/backend"
npx prisma generate

cd "$ROOT_DIR/apps/web"
echo "Cài đặt dependencies cho frontend..."
npm install

cd "$ROOT_DIR/apps/mobile"
echo "Cài đặt dependencies cho mobile..."
flutter pub get
