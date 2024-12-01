const db = require("./models");

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db. Please, wait. This can take a while');
});
