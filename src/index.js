const express = require('express');
const { login, currentUser } = require('./controller/auth');
const { authMiddleware } = require('./middlewares/auth,middleware');
const app = express();
require('./bootfiles');
app.use(express.json());

app.post('/login', login);
app.post('/me', authMiddleware, currentUser);


app.listen(8080, () => {
  console.log(`Server running on port 8080`);
});
