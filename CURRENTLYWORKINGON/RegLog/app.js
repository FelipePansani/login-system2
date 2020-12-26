const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const dbConn = require('./database.js')

dbConn(() => console.log('Mongo Connected...'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }))

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.listen(3000, () => console.log('Express running on port 3000.'));

app.use('/', require('./router.js'))
