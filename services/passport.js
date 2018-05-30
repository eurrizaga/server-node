const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const LocalStrategy = require('passport-local');

//Strategy de passport, forma de validar a un usuario

// create Local (User-password) strategy
const localOptions = { 
    usernameField: 'email',

}
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
    //verificar este user y password, 
    // Si es correcto, llamar done() con el usuario
    //sino llamar donde() en falso
    User.findOne({ email: email}, function(err, user){
        if (err) {return done(err); }
        if (!user) { return done(null, false); }

        //comparar passwords
        user.comparePassword(password, function(err, isMatch){
            if (err) { return done(err); }
            if (!isMatch){ return done(null, false); }
            return done(null, user);
        })
    });

});




// setup options for JWT strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};
// create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    // queremos ver si el user ID en el payload ya existe en la DB
    // si es así llamar done() con ese usuario
    //sino llamar done() sin el usuario
    User.findById(payload.sub, function(err, user){
        if (err) { return done(err, false); } //false implica que no se encontró un usuario
        if (user) {
            done(null, user);
        } else{
            done(null, false);
        }
    })
});



// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
