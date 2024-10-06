const primaryDBConfig = {
  host: 'localhost',
  user: 'root',
  password: 'rootpassword',
  database: 'primary_database'
};

const jwtSecret = 'my_secret';

module.exports = { primaryDBConfig, jwtSecret };
