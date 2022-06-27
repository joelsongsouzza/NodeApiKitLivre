require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  app.use(cors());
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.resolve(__dirname, '..','images','uploads')));

app.use(require('./routes'));

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({ error: error.message})
})
app.listen(3005);