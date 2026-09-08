const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT
const cors = require("cors");
const { connectDb } = require("./src/config/db");
const indexRoutes = require("./src/routes/index.route");



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

// Error handling middleware for invalid JSON input
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ success: false, message: "Invalid JSON format in request body" });
  }
  next(err);
});

app.use("/api", indexRoutes);

app.listen(PORT,()=>{
  console.log(`server sucessfully connectes on ${PORT}`)
})