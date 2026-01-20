const express = require("express")
const db = require("../db")
const crypto = require("crypto")  // built-in for hashing
const router = express.Router()

// helper to hash password
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex")
}

// register a new user
router.post("/register", (req, res) => {
  const { first_name, last_name, username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: "missing username or password" })

  const hashed = hashPassword(password)

  db.run(
    "INSERT INTO users (first_name, last_name, username, password) VALUES (?, ?, ?, ?)",
    [first_name || "", last_name || "", username, hashed],
    function(err) {
      if (err) return res.status(400).json({ error: "username already exists" })
      res.json({ id: this.lastID, username, first_name, last_name })
    }
  )
})

// login user
router.post("/login", (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: "missing username or password" })

  const hashed = hashPassword(password)

  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, hashed],
    (err, row) => {
      if (err) return res.status(500).json({ error: "db error" })
      if (!row) return res.status(400).json({ error: "invalid login" })
      res.json(row)
    }
  )
})

module.exports = router
