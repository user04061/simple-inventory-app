// initialize sqlite
const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./database.db")

db.serialize(() => {
  // table for accounts
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT,
      last_name TEXT,
      username TEXT UNIQUE,
      password TEXT
    )
  `)

  // table for inventory items
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      quantity INTEGER,
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `)
})

module.exports = db
