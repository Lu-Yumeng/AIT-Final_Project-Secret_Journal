require('dotenv').config();

require('./db');
require('./auth');

const passport = require('passport');
const express = require('express');
const path = require('path');
const flash = require('express-flash');

const routes = require('./routes/index');
const list = require('./routes/list');
const listJournals = require('./routes/list-Journals');
const apis = require('./routes/api');

const app = express();
app.use(express.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));
app.use(flash());

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// make user data available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/', routes);
app.use('/list', list);
app.use('/list-journals', listJournals);
app.use('/api',apis);


app.listen(process.env.PORT||3000);
console.log("ready!");
