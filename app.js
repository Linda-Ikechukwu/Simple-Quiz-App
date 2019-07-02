var express = require('express')
var app = express()

app.listen(8000, function () {
  console.log(' app listening on port 8000!')
})

app.use(express.static('src'));
