const express = require("express")
const db = require("./db")
const authRoutes = require("./routes/auth")
const itemsRoutes = require("./routes/items")

const app = express()
const port = 3000

// parse JSON bodies
app.use(express.json())

// middleware to allow frontend access in Chrome
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // allow requests from anywhere
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS") // allow these methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type") // allow Content-Type header
  if (req.method === "OPTIONS") return res.sendStatus(200) // respond OK to preflight
  next()
})

// mount auth routes
app.use("/auth", authRoutes)

// mount items routes
app.use("/items", itemsRoutes)

// simple test endpoint
app.get("/", (req, res) => res.send("backend running"))

// start server
app.listen(port, () => console.log("listening on http://localhost:" + port))
