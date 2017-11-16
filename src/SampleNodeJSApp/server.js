'use strict';

const express = require('express');

const app = express();
app.get('/', (req, res) => {
  res.send('Hello, World!\n');
});

var listener = app.listen(process.env.PORT || 80, function() {
   console.log('Listening on port ' + listener.address().address + ':' + listener.address().port);
});