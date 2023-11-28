const express = require("express")
const app = express()
const mysql = require("mysql")
const cors = require("cors")

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "super-secret-password",
  database: "veichlesregister",
})

app.use(express.json())
app.use(cors())

app.post("/register", (req, res) => {
  const { id, model, automaker, power, year, value } = req.body

  let mysql = "INSERT INTO veichle ( id, model, automaker, power, year, value) VALUES (?, ?, ?, ?, ?, ?)"
  db.query(mysql, [id, model, automaker, power, year, value], (err, result) => {
    res.send(result)
  })
})

app.get("/getVeichles", (req, res) => {
  let mysql = "SELECT * FROM veichle"
  db.query(mysql, (err, result) => {
    res.send(result)
  })
})

app.put("/edit", (req, res) => {
  const { id, model, automaker, power, year, value } = req.body

  let mysql = "UPDATE veichle SET model = ?, automaker = ?, power = ?, year = ?, value= ? WHERE id = ?"
  db.query(mysql, [model, automaker, power, year, value, id], (err, result) => {
    res.send(result)
  })
})

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params
  let mysql = "DELETE FROM veichle WHERE id = ?"
  db.query(mysql, id, (err, result) => {
    res.send(result)
  })
})

app.listen(3001, () => {
  console.log("rodando na porta 3001")
})
