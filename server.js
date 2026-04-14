const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

// 🔐 Environment variables from OpenShift
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME || "mydb";
const DB_HOST = process.env.DB_HOST || "mongo:27017";

// 🧠 Build MongoDB URL dynamically
let MONGO_URL;

if (DB_USER && DB_PASSWORD) {
  MONGO_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?authSource=${DB_NAME}`;
} else {
  MONGO_URL = `mongodb://${DB_HOST}`;
}

let db;

// 🔌 Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URL);

    await client.connect();
    db = client.db(DB_NAME);

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}
