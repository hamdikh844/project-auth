

const express = require("express");
require("dotenv").config();

const mongoose = require("mongoose");

const app = express();


// Middleware to parse JSON
app.use(express.json());
app.use("/api/auth",require("./route/authroute"))

// MongoDB connection
const mongoURI = "mongodb://127.0.0.1:27017/auth?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.4.0";
mongoose.connect(mongoURI).then(()=>console.log("the database connected succesfully 🚀👌💕")).catch((error)=>console.log(error.message))

// Define the port
const PORT = process.env.PORT || 3002;

// Start the server
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});