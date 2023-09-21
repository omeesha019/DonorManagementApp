const express = require('express');
const mongoose = require('mongoose');
const DMARoute = require('./routes/DMARoute')
const cors = require("cors")

require('dotenv').config();

const app = express();
const PORT = process.env.port || 5000;

app.use(express.json())
app.use(cors())

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('connected to mongodb'))
  .catch((err) => console.log(`Error while connecting ${err}`));

app.use('/',DMARoute)

app.listen(PORT, () => console.log(`listening on ${PORT}`));
