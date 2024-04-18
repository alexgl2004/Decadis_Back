var express = require('express');
var router = express.Router();
const db = require('../db');

/**
 * GET actions listing.
*/ 
router.get('/', function (req, res, next) {

  try {

    db.pool.query(
      'SELECT * FROM actions ORDER BY id ASC', 
      (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).json(results.rows)
      }
  )

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error (get USERs)');
  }
  
});

/**
 * GET actions of user listing.
*/ 
router.get('/user/:id', function(req, res, next) {

  try {

    db.pool.query(
      "SELECT * FROM actions WHERE id IN (SELECT action_id as id FROM actions_user WHERE user_id = $1)",
      [
        req.params.id
      ], 
      (error, results) => {
      if (error) {
        throw error
      }
        res.status(200).json(results.rows[0])
      }
  )

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error (get USER)');
  }
  

});

module.exports = router;
