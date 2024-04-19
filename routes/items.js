var express = require('express');
var router = express.Router();
const db = require('../db');

/**
 * GET items listing.
*/ 
router.get('/', function (req, res) {

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
router.get('/positions', function (req, res) {

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
router.post('/add', function(req, res) {

  try {

    db.pool.query(
      "SELECT id FROM actions_user WHERE action_id = 2 AND user_id = $1",
      [
        req.body.user_id
      ], 
      (error, results) => {

        if (error) {
          throw error
        }

        if(results.rows[0]){
            db.pool.query(
              'INSERT INTO items (name, text, user_id, last_changed_by_id) VALUES ($1, $2, $3, $3) RETURNING *', 
              [
                req.body.name,
                req.body.text,
                req.body.user_id
              ],
              (error, results) => {
                if (error) {
                throw error
                }
                res.status(201).json({id:results.rows[0].id})
              }
          )
        }else{
          res.status(200).json({'error':'NO access!'})
        }
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
router.post('/:id', function(req, res) {

  try {

    db.pool.query(
      "SELECT id FROM actions_user WHERE action_id = 2 AND user_id = $1",
      [
        req.body.user_id
      ], 
      (error, results) => {

        if (error) {
          throw error
        }

        if(results.rows[0]){
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
        }else{
          res.status(200).json({'error':'NO access!'})
        }
  
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
router.post('/:id/move', function(req, res) {

  try {

    db.pool.query(
      "SELECT id FROM actions_user WHERE action_id = 2 AND user_id = $1",
      [
        req.body.user_id
      ], 
      (error, results) => {
        
        if (error) {
          throw error
        }

        console.log(results)

        if(results.rows[0]){

          db.pool.query(
            'UPDATE items SET position_id = $1, last_changed_by_id=$3 WHERE id = $2',
            [
              req.body.position_id, 
              req.params.id,
              req.body.user_id
            ],
            (error, results) => {
              if (error) {
                throw error
              }
              res.status(201).json({id:req.params.id})
            }
          )
        }else{
          res.status(200).json({'error':'NO access!'})
        }
  
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
router.post('/:id/delete', function(req, res) {

  try {

    db.pool.query(
      "SELECT id FROM actions_user WHERE action_id = 2 AND user_id = $1",
      [
        req.body.user_id
      ], 
      (error, results) => {
        
        if (error) {
          throw error
        }

        if(results.rows[0]){

          db.pool.query('DELETE FROM items WHERE id = $1', 
          [
            req.params.id
          ], (error, results) => {
            if (error) {
              throw error
            }
            res.status(201).json({id:req.params.id})
          })
        }else{
          res.status(200).json({'error':'NO access!'})
        }
  
      }
    )
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error (delete USER)');
  }

});



module.exports = router;
