const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT
const cors = require("cors");
const { connectDb } = require("./src/config/db");



// init the express app
const app = express();
app.use(express.json());
connectDb();
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: ["POST", "GET"],
  }),
);

app.listen(PORT,()=>{
  console.log(`server sucessfully connectes on ${PORT}`)
})