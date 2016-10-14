var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'rho'
};

var pool = new pg.Pool(config);

router.get('/', function (req, res) {
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM owners JOIN pets ON owners.id = pets.owner_id ORDER BY owners.id;',
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

router.put('/:id', function (req, res) {
  var id = req.params.id;
  var name = req.body.name;
  var breed = req.body.breed;
  var color =  req.body.color;


  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to the DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('UPDATE pets SET name=$1, breed=$2, color=$3 WHERE id=$4 RETURNING *;',
      [name, breed, color, id],
      function (err, result) {
        if (err) {
          console.log('Error querying database', err);
          res.sendStatus(500);

        } else {
          res.send(result.rows);
        }
      });
    } finally {
      done();
    }
  });

});

router.delete('/:id', function(req,res) {
  var id = req.params.id;

  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to the DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('DELETE FROM pets WHERE id=$1;',
        [id],
        function (err, result) {
          if (err) {
            console.log('Error querying database', err);
            res.SendStatus(500);
            return;
          }

          res.send(204); // 204 no content - deleted successfully
        });
    } finally {
      done();
    }
  });
});

module.exports = router;
