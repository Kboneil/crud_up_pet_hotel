var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'rho'
};

// initialized the database connection pool
var pool = new pg.Pool(config);

router.get('/', function (req, res) {
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM owners ORDER BY id;',
            function (err, result) {
              if (err) {
                res.sendStatus(500);
                return;
              }

              res.send(result.rows);
            });
    } finally {
      done();
    }
  });
});

router.post('/', function (req, res) {
  pool.connect(function (err, client, done) {

    try {
      if (err) {
        res.sendStatus(500);
        return;
      }

      client.query('INSERT INTO owners (first_name, last_name) VALUES ($1, $2) returning *',
                [req.body.first_name, req.body.last_name],
                function (err, result) {
                  if (err) {
                    console.log('Issue Querying the DB', err);
                    res.sendStatus(500);
                    return;
                  }

                  res.send(result.rows);
                });
    } finally {
      done();
    }
  });
});


module.exports = router;
