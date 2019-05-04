const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const constant = require('./config/constant');
const errorHandler = require('errorhandler');

const isProduction = process.env.NODE_ENV === 'production';


// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//Initiate our app
const app = express();

if(!isProduction) {
  app.use(errorHandler());
}

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

app.use(session({
  secret: constant.SECRET,
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));


// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
mongoose.set('debug', true);

//routes
const routes = require('./app/routes/route.js');
app.use('/api', routes);
app.get('*', (req, res) => {
    res.status(404).send({
      message: "Route not found"
    });
});
require('./config/passport');


app.listen(8000, () => console.log('Server running on http://localhost:8000/'));