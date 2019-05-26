import express  from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import cors from 'cors'
import errorHandler from 'errorhandler'
import path from "path"
import expressValidator from 'express-validator'
import constant from './config/constant'

const isProduction = process.env.NODE_ENV === 'production';

// Configuring the database
import dbConfig from './config/database.config.js'
import mongoose from 'mongoose'
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

app.use(express.static(path.join(__dirname, 'uploads')));
app.use(expressValidator());

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
mongoose.set('debug', false);

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