var passport = require("passport");
var User = require("../models/user");
var LocalStrategy = require("passport-local").Strategy; //chaining the object `Strategy`
// require('../models/user');

//this function tells passport how to store the user in the session
passport.serializeUser(function(user, done) {
  done(null, user.id); //whenever you want to store user in your session, serialize it by id (hence `user.id`)
});

passport.deserializeUser(function(id, done) {
  //use mongo method to find by id
  User.findById(id, function(err, user) {
    done(err, user); //when using `done`, return err (first) if unsuccessful or the user if successful
  });
});

//----- were not creating a new user yet...

//below we create a new user with a local strategy
//`use` is a passport method that takes the first string argument as the name of the local strategy (below: `local-signup`), and new LocalStrategy takes two argument 1. an object configuration and 2. a call back function
passport.use(
  "local-signup", //signup!
  new LocalStrategy(
    {
      //object configuration
      usernameField: "email", //tell passport that usernameField is email
      passwordField: "password", //tell passport that passwordField is password
      passReqToCallback: true //which means that in the callback function below you can access and use the (request, email, password and done)
    },
    function(req, email, password, done) {
      //the call back function
      //check for validations here, before running the query to database.
      req
        .checkBody("email", " is an invalid email")
        .notEmpty()
        .isEmail();
      req
        .checkBody("password", " is an invalid password")
        .notEmpty()
        .isLength({
          min: 4
        });
      var errors = req.validationErrors(); //local-strategy method that parses through errors
      console.log("req.validationErrors() 44 >>>> ", errors);
      if (errors) {
        var messages = [];
        errors.forEach(function(errors) {
          messages.push(errors.value + "" + errors.msg);
          console.log("messages here >>>>> ", messages);
        });
        return done(null, false, req.flash("error", messages));
      }
      //use mongo method to find one (which is email)
      User.findOne(
        { email: email }, //add closing bracket!
        function(err, user) {
          //equal to the second argument passed in the call back function
          if (err) {
            //check1
            console.log("ERROR HERE passport 59 >>>>>>", err);
            return done(err);
          }
          if (user) {
            console.log("USER HERE >>>>>>>", user);
            //in the next line of code:
            //null -> means no error but also
            //false -> means the process is unsuccessful
            //message -> tells user email is already taken
            return done(null, false, {
              message: "Email is already in use!" //message not messages!
            }); //check2
          }
          //after passing both checks above, we can create a NEW USER
          var newUser = new User();
          console.log("new USER CREATED >>>>>>>>", newUser);
          newUser.email = email;
          newUser.password = newUser.encryptPassword(password); //in user.js (under model folder, we implement bcrypt-nodejs hashing capability)
          newUser.save(function(err, result) {
            //we will save the newUser
            if (err) {
              //check1
              return done(err);
            } else {
              return done(null, newUser);
            }
          });
        }
      );
    }
  )
);

//below we create a new user with a local strategy
//`use` is a passport method that takes the first string argument as the name of the local strategy (below: `local-signup`), and new LocalStrategy takes two argument 1. an object configuration and 2. a call back function
passport.use(
  "local-signin", //signin!
  new LocalStrategy(
    {
      //object configuration
      usernameField: "email", //tell passport that usernameField is email
      passwordField: "password", //tell passport that passwordField is password
      passReqToCallback: true //which means that in the callback function below you can access and use the (request, email, password and done)
    },
    function(req, email, password, done) {
      //the call back function
      //check for validations here, before running the query to database.
      req
        .checkBody("email", " is an invalid email")
        .notEmpty()
        .isEmail();
      req
        .checkBody("password", " is an invalid password")
        .notEmpty()
        .isLength({
          min: 4
        });
      var errors = req.validationErrors(); //local-strategy method that parses through errors
      console.log("req.validationErrors() 118 >>>> ", errors);
      if (errors) {
        var messages = [];
        errors.forEach(function(errors) {
          messages.push(errors.value + "" + errors.msg);
          console.log("messages here >>>>> ", messages);
        });
        return done(null, false, req.flash("error", messages));
      }
      //use mongo method to find one (which is email)
      User.findOne(
        { email: email }, //add closing bracket!
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {message: 'No user with that email.'});
          }
          if (user.validPassword(password)) {
            console.log("Logging validPassword function >>>>> ", !user.validPassword(password));
            return done(null, false, {
              message: "Entered a wrong password."
            });
          }
          return done(null, user);
          //equal to the second argument passed in the call back function
          // if (err) {
          //   //check1
          //   console.log("ERROR HERE passport 59 >>>>>>", err);
          //   return done(err);
          // }
          // if (!user) {
          //   console.log("USER AFTER SIGNIN! >>>>>>>", user);
          //   //in the next line of code:
          //   //null -> means no error but also
          //   //false -> means the process is unsuccessful
          //   //message -> tells user email is already taken
          //   return done(null, false, {
          //     message: "No user of that email found" //message not messages!
          //   }); //check2
          // }
          // if (!user.validPassword(password)) {
          //   console.log("USER AFTER SIGNIN! >>>>>>>", password);
          //   return done(null, false, {
          //     message: "Entered a wrong password" //message not messages!
          //   }); //check2
          // }
          //after passing checks above, we can RETURN user
        }
      );
    }
  )
);
