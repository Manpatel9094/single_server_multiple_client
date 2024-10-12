# Multi-Database User Management System

This project implements a multi-database user management system using Node.js, Express, and MySQL. It allows for the management of users and their associated companies, where each company can have its own database.

## Features

- User authentication with JWT
- Multi-database connection based on user company
- Dynamic database selection based on user credentials
- Company-specific information storage

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Database Setup](#database-setup)
- [API Requests](#api-requests)

## Installation

1. Clone the repository
   
   with ssh:
   ```bash
   git clone git@github.com:Manpatel9094/single_server_multiple_client.git
   cd single_server_multiple_client
   ```

   with https:
   ```bash
   git clone https://github.com/Manpatel9094/single_server_multiple_client.git
   cd single_server_multiple_client
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your database configuration:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=primary_database
   ```

## Usage

1. Start the server:
   ```bash
   npm run dev
   ```

2. The server will be running on `http://localhost:8080`.

## Database Setup

### Use the Primary Database

```sql
USE primary_database;
```

### Create the 'companies' Table

```sql
CREATE TABLE IF NOT EXISTS companies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  db_name VARCHAR(255) NOT NULL,
  db_user VARCHAR(255) NOT NULL,
  db_password VARCHAR(255) NOT NULL,
  host VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Create the 'users' Table

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  company_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);
```

### Use the Company A Database

```sql
USE company_a_db;
```

### Create the 'company_info' Table for Company A

```sql
CREATE TABLE IF NOT EXISTS company_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Insert Initial Data for Company A

```sql
INSERT INTO company_info (company_name, address, phone, email)
VALUES
('Company A', '123 Main St, City A', '123-456-7890', 'contact@companya.com')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    address = VALUES(address),
    phone = VALUES(phone),
    email = VALUES(email);
```

### Use the Company B Database

```sql
USE company_b_db;
```

### Create the 'company_info' Table for Company B

```sql
CREATE TABLE IF NOT EXISTS company_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Insert Initial Data for Company B

```sql
INSERT INTO company_info (company_name, address, phone, email)
VALUES
('Company B', '456 Another St, City B', '987-654-3210', 'contact@companyb.com')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    address = VALUES(address),
    phone = VALUES(phone),
    email = VALUES(email);
```

## API Requests

### Login API Request

Use the following `curl` command to log in as a user. Replace `user2@example.com` and `password456` with the desired credentials.

```bash
curl --location 'http://localhost:8080/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "user2@example.com",
  "password": "password456"
}'
```

### Retrieve Current User API Request

After logging in, use this command to retrieve the current user information. Replace `{{TOKEN}}` with the actual JWT token obtained from the login response.

```bash
curl --location 'http://localhost:8080/me' \
--header 'Content-Type: application/json' \
--header 'Authorization: {{TOKEN}}' \
--data-raw '{
  "email": "user1@example.com",
  "password": "password123"
}'
```

