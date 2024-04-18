var express = require('express');
var router = express.Router();
const db = require('../db');

/**
 * GET items listing.
*/ 
router.get('/', function (req, res, next) {

  try {

    db.pool.query(
      'SELECT * FROM items ORDER BY id ASC', 
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
 * GET positions listing.
*/ 
router.get('/positions', function (req, res, next) {

  try {

    db.pool.query(
      'SELECT * FROM positions ORDER BY id ASC', 
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
 * Create item.
*/ 
router.post('/add', function(req, res, next) {

  try {

    //[+] Add function to check rights for move //POST req.body.user_id

    db.pool.query(
      'INSERT INTO items (name, text, user_id) VALUES ($1, $2, $3)', 
      [
        req.body.name,
        req.body.text,
        req.body.user_id
      ],
      (error, results) => {
        if (error) {
        throw error
        }
        response.status(201).json({id:results.insertId})
      }
  )

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error (add USER)');
  }

});

/**
 * GET item.
*/
router.post('/:id', function(req, res, next) {

  try {

    //[+] Add function to check rights for move //POST req.body.user_id

    db.pool.query(
      "SELECT * FROM items WHERE id = $1",
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

/**
 * Move item.
*/
router.post('/:id/move', function(req, res, next) {

  try {

    //[+] Add function to check rights for move //POST req.body.user_id

    db.pool.query(
      'UPDATE items SET position_id = $1 WHERE id = $2',
      [
        req.body.position_id, 
        req.params.id
      ],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).json({id:req.params.id})
      }
    )

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error (update USER)');
  }

});

/**
 * detele item.
*/ 
router.post('/:id/delete', function(req, res, next) {

  try {

    //[+] Add function to check rights for delete //POST req.body.user_id

    db.pool.query('DELETE FROM items WHERE id = $1', 
    [
      req.params.id
    ], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).json({id:req.params.id})
    })

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error (delete USER)');
  }

});



module.exports = router;
