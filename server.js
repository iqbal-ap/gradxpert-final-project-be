require('dotenv').config();
const app = require('./app');
const { authenticateDb } = require('./helper/db');
const { DbConnection } = require('./models/index');
const port = process.env.PORT;

app.listen(port, async () => {
  await authenticateDb(DbConnection);
  console.log(`App listening on port ${port}`);
});