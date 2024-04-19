//Не работает!!! доделать

var express = require('express');
var router = express.Router();
const db2 = require('../db_knex/db');
//import { db2 } from '../db_knex/db'

router.get('/', function (req, res) {

//  console.log(1,db2)


  try {
/*
  db2("users").insert([
    {
      firstname: "teacher",
    },
    {
      lastname: "manager",
    },
    {
      email: "student",
    },
  ]);
*/
/***/
    db2.schema.dropTableIfExists("roles");
    db2.schema.createTable("roles", (table) => {
      table.increments("id").primary();
      table.string("name");
    });

    db2.schema.dropTableIfExists("role_rules");
    db2.schema.createTable("role_rules", (table) => {
      table.increments("id").primary();
      table.integer("role_id").references("roles.id");
      table.string("name");
      table.integer("checked");
      table.string("rules");
    });

/***/
    db2("roles").insert([
      {
        name: "teacher",
      },
      {
        name: "manager",
      },
      {
        name: "student",
      },
    ]);

    db2("role_rules").insert([
      {
        role_id: 1,
        name:"folders",
        checked:1,
        rules:"quiz,questions,stat",
      },
      {
        role_id: 2,
        name:"folders",
        checked:1,
        rules:"students,rooms,kits,results",
      },
      {
        role_id: 3,
        name:"folders",
        checked:1,
        rules:"results",
      },
    ]);
       
/***/
    return res.json({
      msg: "db reset successful",
    });
  } catch (err) {
    console.error(err);
    res.json({
      msg: err + ". db reset failed",
    });
  }

})

module.exports = router;