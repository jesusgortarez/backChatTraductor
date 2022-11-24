const mongoose = require('mongoose');
require('dotenv').config();
const URI = process.env.MONGODB_URI;
console.log(URI);

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conexión correcta DB");
  })
  .catch((err) => {
    console.log(err.message);
  });
