var express = require('express');
var app = express();

app.listen(3000, function () {
    console.log('server running on port 3000');
});

app.get('/dalembert', callD_alembert);

function callD_alembert(req, res) {
  // using spawn instead of exec, prefer a stream over a buffer
  // to avoid maxBuffer issue
  var spawn = require("child_process").spawn;
  var process = spawn('python', ["./d_alembert.py",
    req.query.funds, // starting funds
    req.query.size, // (initial) wager size
    req.query.count, // wager count - number of wagers per sim
    req.query.sims // number of simulations
  ]);

  process.stdout.on('data', function (data) {
    res.send(data.toString());
  });
}


var PythonShell = require('python-shell');

app.get('/dalembert2', callD_alembert2);

function callD_alembert2(req, res) {
  var options = {
    args:
    [
      req.query.funds, // starting funds
      req.query.size, // (initial) wager size
      req.query.count, // wager count - number of wagers per sim
      req.query.sims // number of simulations
    ]
  }

  PythonShell.run('./d_alembert.py', options, function (err, data) {
    if (err) res.send(err);
    res.send(data.toString())
  });
}

