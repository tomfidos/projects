const express = require('express');
const path = require('path');
const router = require('./routes');

const port = 3000;

const app = express();
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, './public')));
app.use('/results', router);
app.listen(port, () => {console.log(`Server is listening on port ${port}`)});
