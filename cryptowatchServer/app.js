const express = require('express');
const path = require('path');
const Router = require('./routes');

const port = 3000;

const app = express();
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, './public')));
app.use('/sampleResult', Router);
app.listen(port, () => {console.log(`Server is listening on port ${port}`)});
