-- Use the Primary database
USE primary_database;

-- Create the 'companies' table
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

-- Create the 'users' table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  company_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);


-- Use the company A database
USE company_a_db;

-- Create the 'company_info' table
CREATE TABLE IF NOT EXISTS company_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial data for Company A
INSERT INTO company_info (company_name, address, phone, email)
VALUES
('Company A', '123 Main St, City A', '123-456-7890', 'contact@companya.com')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    address = VALUES(address),
    phone = VALUES(phone),
    email = VALUES(email);

-- Use the company B database
USE company_b_db;

-- Create the 'company_info' table
CREATE TABLE IF NOT EXISTS company_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial data for Company B
INSERT INTO company_info (company_name, address, phone, email)
VALUES
('Company B', '456 Another St, City B', '987-654-3210', 'contact@companyb.com')
ON DUPLICATE KEY UPDATE
    company_name = VALUES(company_name),
    address = VALUES(address),
    phone = VALUES(phone),
    email = VALUES(email);



curl --location 'http://localhost:8080/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "user2@example.com",
  "password": "password456"
}'


curl --location 'http://localhost:8080/me' \
--header 'Content-Type: application/json' \
--header 'Authorization: {{TOKEN}}' \
--data-raw '{
  "email": "user1@example.com",
  "password": "password123"
}'
