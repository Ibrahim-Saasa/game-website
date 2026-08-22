# Backend Setup

## 1. Place the project in XAMPP

Copy this folder to:

```text
C:\xampp\htdocs\game-website
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
http://localhost/game-website/api/health.php
```

A successful setup returns JSON with `"status":"ok"` and the product count.

The default XAMPP credentials are configured in `config/database.php` (`root` with an empty password). Change them there if your MySQL installation uses a password.
