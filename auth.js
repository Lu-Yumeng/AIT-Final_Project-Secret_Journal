const mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User'),
    bcrypt = require('bcrypt');

// based on tutorial: https://www.passportjs.org/tutorials/password/
passport.use(new LocalStrategy((username,password,done)=>{
    User.findOne({username}, async function(err, user) {
        if (err) { return done(err); }
        if (user === null) { 
          return done(null, false, { message: 'User does not exist ..'}); 
        }
        try{
            if (await bcrypt.compare(password,user.password)){
                return done(null, user);
            } else{
                return done(null, false, { message: 'Sorry .. wrong password'}); 
            }
        } catch (e){
            return done(e);
        }
});}));

// passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
    done(null, user.id); 
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
