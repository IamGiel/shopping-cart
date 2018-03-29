// import { extname } from 'path';

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session')//to use csurf you need session installed
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');



//route
var indexRouter = require("./routes/index");

var app = express();

//mongoose connect method
//expects an input, which is the path of the server, you can check it after you ran mongod
//the `/shopping` is the name of the database you intend to create
mongoose.connect("mongodb://localhost:27017/shopping");
//require helper -> config/passport here after mongoose connect
require('./config/passport')

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'})) //extname helps identify the name of the files in view folder as `.hbs`
app.set('view engine', '.hbs');//this refers to the engine above '.hbs'

app.use(logger('dev'));
app.use(express.json());
// parse urlencoded request bodies into req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(validator());
app.use(cookieParser());
app.use(session({secret:'mysecret', resave: false, saveUninitialized: false}));//session initialized
//resave = true, session will be saved on a server on each request no matter it saved or not - depracated
//saveUninitialized = true, the essions will be saved even if its not intialized - depracated

//add flash  and passport after  session secret is initialized ORDER MATTERS
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
