const express = require('express');
const Router = require('./routes');

const port = 3000;

const app = express();
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('./public'));
app.get('/', (req, res, next) => {res.send('Cryptowatch Server')});
app.use('/sampleResult', Router);
app.listen(port, () => {console.log(`Server is listening on port ${port}`)});
