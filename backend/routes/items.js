const express = require("express")
const db = require("../db")
const router = express.Router()

// create a new item
router.post("/", (req, res) => {
  const { name, description, quantity, user_id } = req.body
  if (!name || !description || quantity == null) return res.status(400).json({ error: "missing item fields" })

  db.run(
    "INSERT INTO items (name, description, quantity, user_id) VALUES (?, ?, ?, ?)",
    [name, description, quantity, user_id],
    function(err) {
      if (err) return res.status(500).json({ error: "db error" })
      res.json({ id: this.lastID, name, description, quantity, user_id })
    }
  )
})

// get all items
router.get("/", (req, res) => {
  db.all("SELECT * FROM items", [], (err, items) => {
    if (err) return res.status(500).json({ error: "db error" })
    res.json(items)
  })
})

// get single item by id
router.get("/:id", (req, res) => {
  const id = req.params.id
  db.get("SELECT * FROM items WHERE id = ?", [id], (err, item) => {
    if (err) return res.status(500).json({ error: "db error" })
    if (!item) return res.status(404).json({ error: "item not found" })
    res.json(item)
  })
})

// update an item by id
router.put("/:id", (req, res) => {
  const id = req.params.id
  const { name, description, quantity } = req.body
  if (!name || !description || quantity == null) return res.status(400).json({ error: "missing item fields" })

  db.run(
    "UPDATE items SET name = ?, description = ?, quantity = ? WHERE id = ?",
    [name, description, quantity, id],
    function(err) {
      if (err) return res.status(500).json({ error: "db error" })
      res.json({ id, name, description, quantity })
    }
  )
})

// delete an item by id
router.delete("/:id", (req, res) => {
  const id = req.params.id
  db.run("DELETE FROM items WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: "db error" })
    res.json({ deleted: id })
  })
})

module.exports = router
