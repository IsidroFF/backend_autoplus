const app = require('./app.js');
const dotenv = require('dotenv');
require('dotenv').config()

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
