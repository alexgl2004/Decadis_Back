//console.log(process.env.POSTGRES_HOST)

const db2 = require('knex')({
  client: "pg",
  connection: {

    host: 'localhost',
    port: 5432,
    user: 'decadis',
    password: 'decadis1',
    database: 'Decadis',

  },
});

//console.log(db2)

module.exports = db2;
