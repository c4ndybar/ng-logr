const express = require('express')
const http = require('http')
const app = express()
const bodyParser = require('body-parser')
const port = 4201

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*, authorization, content-type')
  next()
})

app.post('/log', (req, res) => {
  console.log(req.body)
  res.json()
})

http.createServer(app).listen(port)
console.log('Http: listening on port ' + port)
