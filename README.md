# AgriCommercePlatform

Nền tảng thương mại điện tử dành cho lĩnh vực nông nghiệp, được xây dựng với **NestJS** theo kiến trúc tối giản nhưng rõ ràng (minimalist but clean architecture).

## Giới thiệu

AgriCommercePlatform được tổ chức theo dạng monorepo, tách biệt giữa các ứng dụng (`apps`) và hạ tầng (`infra`).

## Công nghệ sử dụng

- **NestJS** (TypeScript) – Backend framework chính
- **React + Vite - Frontend
- **PostgreSQL** (PLpgSQL) – Cơ sở dữ liệu
- **Nix** – Quản lý môi trường phát triển
- **Shell script** – Script cài đặt và cấu hình

## Cấu trúc dự án

```
.
├── apps/                 # Các ứng dụng / services
├── infra/                # Cấu hình hạ tầng (database, docker, ...)
├── temp-bcrypt-test/     # Thư mục thử nghiệm mã hóa mật khẩu
├── .vscode/              # Cấu hình VSCode
├── flake.nix / flake.lock
├── .gitignore
└── README.md
```

## Cài đặt và chạy dự án

### 1. Clone dự án

```bash
git clone https://github.com/mellivora24/AgriMart.git
cd AgriMart
```

### 2. Chạy script cài đặt

```bash
bash setup.sh
```

> Script này sẽ tự động cài đặt các dependencies và cấu hình môi trường cần thiết.

### 3. (Tùy chọn) Sử dụng Nix

Nếu bạn dùng Nix, có thể khởi tạo môi trường phát triển bằng:

```bash
nix develop
```
