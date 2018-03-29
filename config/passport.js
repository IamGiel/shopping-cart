var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;//chaining the object `Strategy`

//this function tells passport how to store the user in the session
passport.serializeUser(function (user, done){
  done('null', user.id);//whenever you want to store user in your session, serialize it by id (hence `user.id`)
});

passport.deserializeUser(function (id, done){
  //use mongo method to find by id
  User.findById(id, function(err, user){
    done(err, user);//when using `done`, return err (first) if unsuccessful or the user if successful
  })
})

//----- were not creating a new user yet...

//below we create a new user with a local strategy
//`use` is a passport method that takes the first string argument as the name of the local strategy (below: `local-signup`), and new LocalStrategy takes two argument 1. an object configuration and 2. a call back function
passport.use('local-signup', new LocalStrategy({
  //object configuration
  usernameField: 'email',//tell passport that usernameField is email
  passwordField: 'password',//tell passport that passwordField is password
  passReqToCallback: true//which means that in the callback function below you can access and use the (request, email, password and done)
  //the call back function
}, function(req, email, password, done){
  //use mongo method to find one (which is email)
  User.findOne({
    Email: email, //equal to the second argument passed in the call back function
    function(err, user) {
      if (err) {;//check1
        return done(err);
      }
      if (user) {
        //in the next line of code:
        //null -> means no error but also
        //false -> means the process is unsuccessful
        //message -> tells user email is already taken
        return done('null', false, {message: "Email is already in use!"});//check2
      }
      //after passing both checks above, we can create a NEW USER
      var newUser = new User();
      newUser.email = email;
      newUser.password = newUser.encryptPassword(password);//in user.js (under model folder, we implement bcrypt-nodejs hashing capability)
      newUser.save(function(err, result){//we will save the newUser
        if (err) {
          //check1
          return done(err);
        }
        return done('null', newUser);
      })

    }
  })

}))
