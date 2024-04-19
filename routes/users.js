var express = require('express');
var router = express.Router();
const db = require('../db');

/**
 * GET users listing.
*/ 
router.get('/', function (req, res) {

  try {

    db.pool.query(
//      'SELECT * FROM users ORDER BY id ASC', 
      "SELECT users.*, ac.action_ids FROM users, (SELECT array_to_string(array_agg(action_id), ',') as action_ids, user_id FROM actions_user GROUP BY user_id) as ac WHERE users.id=ac.user_id",
      (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).json({usersData:results.rows})
      }
  )

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error (get USERs)');
  }
  
});

/**
 * add user.
*/ 
router.post('/add', function(req, res) {

//  console.log(req.body)

  try {

    db.pool.query(
      'INSERT INTO users (firstname, lastname, email) VALUES ($1, $2, $3) RETURNING *', 
      [
        req.body.firstname,
        req.body.lastname,
        req.body.email
      ],
      (error, results) => {
        if (error) {
          throw error
        }

        let created_id = results.rows[0].id

        if(req.body.action_ids.length>0){   

          const action_ids_lines = req.body.action_ids.map((elem)=>{
            return '('+elem+','+created_id+')'
          }).join(',')

          db.pool.query(
            'INSERT INTO actions_user (action_id,user_id) VALUES ' + action_ids_lines,
            (error, results) => {
              if (error) {
                throw error
              }
              res.status(201).json({id:created_id})
            }
          )
        }else{
          res.status(201).json({id:created_id})
        }
        
      }
   )

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error (add USER)');
  }

});

/**
 * GET user.
*/
router.get('/:id', function(req, res) {

  try {

    db.pool.query(
      "SELECT users.*, ac.action_ids FROM users, (SELECT array_to_string(array_agg(action_id), ',') as action_ids, user_id FROM actions_user WHERE user_id = $1 GROUP BY user_id) as ac WHERE id = $1",
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
 * edit user.
*/ 
router.post('/:id/edit', function(req, res) {

//  console.log(req.body, req.params)

  try {

    db.pool.query(
      'UPDATE users SET firstname = $1, lastname = $2, email = $3 WHERE id = $4',
      [
        req.body.firstname, 
        req.body.lastname, 
        req.body.email,
        req.params.id
      ],
      (error, results) => {
        if (error) {
          throw error
        }
        db.pool.query(
          'DELETE FROM actions_user WHERE user_id = $1',
          [
            req.params.id
          ],
          (error, results) => {
            if (error) {
              throw error
            }
            if(req.body.action_ids.length>0){
              const action_ids_lines = req.body.action_ids.map((elem)=>{
                return '('+elem+','+req.params.id+')'
              }).join(',')
              db.pool.query(
                'INSERT INTO actions_user (action_id,user_id) VALUES ' + action_ids_lines,
                (error, results) => {
                  if (error) {
                    throw error
                  }
                  res.status(201).json({id:req.params.id})
                }
              )
            }else{
              res.status(201).json({id:req.params.id})
            }
          }
        )
      }
    )

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error (update USER)');
  }

});

/**
 * delete user.
*/ 
router.get('/:id/delete', function(req, res) {

  try {

    db.pool.query('DELETE FROM items WHERE user_id = $1', 
    [
      req.params.id
    ], (error, results) => {
      if (error) {
        throw error
      }
      db.pool.query('DELETE FROM users WHERE id = $1', 
      [
        req.params.id
      ], (error, results) => {
        if (error) {
          throw error
        }
        db.pool.query('DELETE FROM actions_user WHERE user_id = $1', 
        [
          req.params.id
        ], (error, results) => {
          if (error) {
            throw error
          }
          res.status(201).json({id:req.params.id})
        })
      })
    })

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error (delete USER)');
  }

});



module.exports = router;
