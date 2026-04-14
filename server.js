const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

// 👉 OpenShift will inject this via env variable
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "mydb";

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

// 📌 Test route
app.get("/", (req, res) => {
  res.send("Node.js API Gateway is running 🚀");
});

// 📌 Create data
app.post("/users", async (req, res) => {
  try {
    const user = req.body;

    const result = await db.collection("users").insertOne(user);

    res.json({
      message: "User created",
      id: result.insertedId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await db.collection("users").find().toArray();
    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Start server AFTER DB connection
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
