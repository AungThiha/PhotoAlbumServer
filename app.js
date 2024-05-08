const bodyParser = require('body-parser')
const cors = require('cors')
const db = require("./models");
const express = require('express')

const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// sync shouldn't be used in production
// see https://sequelize.org/docs/v7/models/migrations/ for db migration in production
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
});

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

// routes
require('./routes/auth.routes')(app);

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
