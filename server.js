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

/* =========================
   🔌 CONNECT TO MONGODB
========================= */
async function connectDB() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    console.log("📡 URL:", MONGO_URL);

    const client = new MongoClient(MONGO_URL);
    await client.connect();

    db = client.db(DB_NAME);

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

/* =========================
   🧪 TEST ROUTES
========================= */

// Root (for browser test)
app.get("/", (req, res) => {
  res.send("🚀 Node API is running");
});

// API test (IMPORTANT for /api routing)
app.get("/api/test", (req, res) => {
  res.json({
    message: "✅ /api is working",
    time: new Date(),
  });
});

/* =========================
   👤 USERS API
========================= */

// Create user
app.post("/api/users", async (req, res) => {
  try {
    const user = req.body;

    const result = await db.collection("users").insertOne(user);

    res.json({
      message: "User created",
      id: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get users
app.get("/api/users", async (req, res) => {
  try {
    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🚀 START SERVER
========================= */

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
