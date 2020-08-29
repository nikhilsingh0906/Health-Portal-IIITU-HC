
let authentication = (app, passport) => {
    const users = require('../models/users')
    const localStrategy = require('passport-local').Strategy;
    const crypto = require('crypto');

    passport.use(new localStrategy({
        usernameField : 'email',
        passwordField : 'password',
        session : true,
        passReqToCallback : true
    }, (req, username, password, done) => {
        users.findOne({email : username}, function(err, user){
            if(err){
                return done(error);
            }
            if(!user){
                return done(null, false, req.flash('error', 'Email is not resgistered'));
            }

            let pass = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
            if(pass === user.password){
                return done(null, user);
            }
            else{
                return done(err, false, req.flash('error', 'Password is incorrect'));
            }
            
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
        users.findById(id, function(err, user) {
          done(err, user);
        });
    });
};


module.exports = {
    authentication,
}