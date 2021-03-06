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
var MongoStore = require('connect-mongo')(session);//pass the object session



//route
var router = require("./routes/index");
var userRouter = require("./routes/user");

var app = express();
const PORT = process.env.PORT || 3004;

//mongoose connect method
//expects an input, which is the path of the server, you can check it after you ran mongod
//the `/shopping` is the name of the database you intend to create
// mongoose.connect("mongodb://localhost:27017/shopping");


// Set up promises with mongoose
mongoose.Promise = global.Promise;
// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/shopping"
);
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
app.use(validator());//parses the body and retrieve the parameters you want to validate from bodyParser
app.use(cookieParser());
app.use(session(
  {
    secret:'mysecret', 
    resave: false, 
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),//tell mongooseConnection not open a new connection on its own.
    cookie: { maxAge: 180 * 60 * 1000 }//session configuration that determines how long the session should live.  180 = 3 hours.
  }
));//session initialized
//resave = true, session will be saved on a server on each request no matter it saved or not - depracated
//saveUninitialized = true, the essions will be saved even if its not intialized - depracated

//add flash  and passport after  session secret is initialized ORDER MATTERS
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));


//add another middle ware executed in all request
app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated(); //locals set a global property which is available in all views `login` is something you can rename
  res.locals.session = req.session; //make sure we can access `session` variable in all the views
  next();
})
app.use('/', router);
app.use('/user', userRouter);

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

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});

module.exports = app;
