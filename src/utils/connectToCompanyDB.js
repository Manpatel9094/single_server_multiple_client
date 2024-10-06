const mysql = require('mysql2/promise');
const { primaryDBConfig } = require('../config');

const connectToCompanyDB = async (companyId) => {
  let primaryConnection;

  try {
    primaryConnection = await mysql.createConnection(primaryDBConfig);

    const [companies] = await primaryConnection.execute(
      'SELECT * FROM companies WHERE id = ?',
      [companyId]
    );

    if (companies.length === 0) {
      throw new Error('Company not found');
    }

    const company = companies[0];

    const companyDBConfig = {
      host: company.host,
      user: company.db_user,
      password: company.db_password,
      database: company.db_name
    };

    const companyConnection = await mysql.createConnection(companyDBConfig);
    console.log(`Connected to the database for ${company.name}`);

    return { companyConnection, companyName: company.name };
  } catch (error) {
    console.error('Error connecting to the company database:', error);
    throw error;
  } finally {
    if (primaryConnection) {
      await primaryConnection.end();
    }
  }
};

module.exports = connectToCompanyDB;
