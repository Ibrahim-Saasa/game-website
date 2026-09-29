# Backend Setup

## 1. Place the project in XAMPP

Copy this folder to:

```text
C:\xampp\htdocs\gaming-web
```

Start **Apache** and **MySQL** from the XAMPP Control Panel.

## 2. Create the database

Open `http://localhost/phpmyadmin`, select the **Import** tab, and import:

```text
database/schema.sql
```

The script creates the `gaming_web` database, its tables, and the initial product records.

## 3. Test the connection

Open this URL in a browser:

```text
http://localhost/gaming-web/api/health.php
```

A successful setup returns JSON with `"status":"ok"` and the product count.

The default XAMPP credentials are configured in `config/database.php` (`root` with an empty password). Change them there if your MySQL installation uses a password.

## 4. Enable profiles and product collections

For an existing database, import `database/profile_migration.sql` through phpMyAdmin. It adds an optional avatar path to users and creates the wishlist and demo-purchase tables without deleting existing accounts or products.

For a fresh database, import `database/schema.sql`, which already includes those fields and tables.

Signed-in users can open `http://localhost/gaming-web/profile.html` to edit their player name and profile image, view wishlist items and demo purchases, or sign out. The Products details modal supports saving an item or recording a demo purchase. Demo purchases are history entries only; no payment is collected.

Profile images are limited to JPEG, PNG, or WebP files up to 2 MB and are stored in `uploads/avatars`.
