'use strict';

const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.send('From '+ process.env.CONTAINER_HOST + ': Hello, World!\n');
});

var listener = app.listen(process.env.PORT || 80, function() {
   console.log('Listening on port ' + listener.address().port);
});