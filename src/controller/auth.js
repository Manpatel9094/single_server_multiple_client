const { primaryDBConfig } = require("../config");
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils/jwt");
const connectToCompanyDB = require("../utils/connectToCompanyDB");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const primaryDB = await mysql.createConnection(primaryDBConfig);
    const [users] = await primaryDB.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(400).send('User not found');
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).send('Invalid password');
    }

    const token = generateToken(user);
    res.json({ token });
    await primaryDB.end();
  } catch (error) {
    res.status(500).send('Server error');
  }
};

const currentUser = async (req, res) => {
  const { id, company_id } = req.user;
  const { companyConnection } = await connectToCompanyDB(company_id);

  const [companyInfo] = await companyConnection.execute('SELECT company_name, address, phone, email FROM company_info');

  await companyConnection.end();

  res.json({
    id,
    email: req.user.email,
    company: companyInfo,
  });
};

module.exports = {
  login,
  currentUser
};
