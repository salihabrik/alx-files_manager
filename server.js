const express = require('express');
const router = require('./routes/index');

const app = express();
app.use(express.json());
app.use(router);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Express app is listening on port', port);
});

module.exports = app;
