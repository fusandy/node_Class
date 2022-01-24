const express = require('express')
var cors = require('cors')
const app = express()

app.use(cors())

app.post('/', cors(), function (req, res) {
  res.send('Hello World')
})

app.get('/', cors(), function (req, res) {
  res.send('Hello World')
});



console.log("server is on: http://localhost:3000/")
app.listen(3000)