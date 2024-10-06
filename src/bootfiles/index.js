const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { primaryDBConfig } = require('../config');
require('dotenv').config();

// Update: Add the host for each company
const companies = [
  { name: 'Company A', db_name: 'company_a_db', db_user: 'root', db_password: 'rootpassword', host: 'localhost' },
  { name: 'Company B', db_name: 'company_b_db', db_user: 'root', db_password: 'rootpassword', host: 'localhost' },
];

const users = [
  { email: 'user1@example.com', password: 'password123', company_name: 'Company A' },
  { email: 'user2@example.com', password: 'password456', company_name: 'Company B' },
];

// Function to create companies table
const createCompaniesTable = async (connection) => {
  const createTableQuery = `
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
  `;
  await connection.execute(createTableQuery);
  console.log('Companies table created (if not exists).');
};

// Function to create users table
const createUsersTable = async (connection) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      company_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
    );
  `;
  await connection.execute(createTableQuery);
  console.log('Users table created (if not exists).');
};

// Function to check if company already exists
const companyExists = async (connection, name) => {
  const [rows] = await connection.execute('SELECT * FROM companies WHERE name = ?', [name]);
  return rows.length > 0;
};

// Function to check if user already exists
const userExists = async (connection, email) => {
  const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows.length > 0;
};

// Function to insert company data
const insertCompanies = async (connection) => {
  for (const company of companies) {
    const exists = await companyExists(connection, company.name);
    if (exists) {
      console.log(`Company ${company.name} already exists. Skipping...`);
      continue;
    }

    // Insert the company record with the host
    await connection.execute(
      'INSERT INTO companies (name, db_name, db_user, db_password, host) VALUES (?, ?, ?, ?, ?)',
      [company.name, company.db_name, company.db_user, company.db_password, company.host]
    );
    console.log(`Inserted company: ${company.name}`);
  }
};

// Function to insert user data
const insertUsers = async (connection) => {
  for (const user of users) {
    const exists = await userExists(connection, user.email);
    if (exists) {
      console.log(`User ${user.email} already exists. Skipping...`);
      continue;
    }

    const [companyRows] = await connection.execute('SELECT id FROM companies WHERE name = ?', [user.company_name]);
    if (companyRows.length === 0) {
      console.error(`Company ${user.company_name} not found. Skipping user ${user.email}...`);
      continue;
    }

    const companyId = companyRows[0].id;

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await connection.execute(
      'INSERT INTO users (email, password, company_id) VALUES (?, ?, ?)',
      [user.email, hashedPassword, companyId]
    );
    console.log(`Inserted user: ${user.email}`);
  }
};

// Main function to run the boot process
const main = async () => {
  let connection;
  try {
    connection = await mysql.createConnection(primaryDBConfig);
    console.log('Connected to the primary database');

    // Create tables
    await createCompaniesTable(connection);
    await createUsersTable(connection);

    // Insert data
    await insertCompanies(connection);
    await insertUsers(connection);

    console.log('Tables created and records inserted successfully');
  } catch (error) {
    console.error('Error inserting records:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

main();
