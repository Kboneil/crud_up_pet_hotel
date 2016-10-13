var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'rho'
};

var pool = new pg.Pool(config);

router.post('/', function (req, res) {
  pool.connect(function (err, client, done) {
    console.log('req: ', req.body);
    try {
      if (err) {
        res.sendStatus(500);
        return;
      }

      client.query('INSERT INTO pets (name, color, breed, owner_id) VALUES ($1, $2, $3, $4) RETURNING *;',
        [req.body.pet_name, req.body.color, req.body.breed, parseInt(req.body.owner_id)],
        function (err, result) {
          if (err) {
            console.log('Issue Querying the DB', err);
            res.sendStatus(500);
            return;
          }

          res.send(result.rows);
        })
    } finally {
      done();
    }
  });
});

module.exports = router;
