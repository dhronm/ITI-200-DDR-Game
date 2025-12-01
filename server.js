require("dotenv").config();
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const isProd = !!process.env.DATABASE_URL;

const pool = new Pool(
    isProd
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {

        user: "postgres",           
        host: "localhost",
        database: "arrowstorm",     
        password: "oliverferg",  
        port: 5432,
    }
);



app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));

app.post("/api/score", async (req, res) => {
  try {
    const { username, score } = req.body;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "username is required" });
    }
    if (typeof score !== "number") {
      return res.status(400).json({ error: "score must be a number" });
    }

    const result = await pool.query(
      `INSERT INTO scores (username, score)
       VALUES ($1, $2)
       RETURNING id, username, score, created_at`,
      [username.trim(), score]
    );

    res.status(201).json({ success: true, score: result.rows[0] });
  } catch (err) {
    console.error("Error saving score:", err);
    res.status(500).json({ error: "internal server error" });
  }
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT username, score, created_at
       FROM scores
       ORDER BY score DESC, created_at ASC
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error loading leaderboard:", err);
    res.status(500).json({ error: "internal server error" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Arrow Storm server running on http://localhost:${PORT}`);
});
