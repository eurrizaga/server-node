const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');


//usar passport para autenticar por metodo jwt y al terminar no crear una sesión mediante cookies
const requireAuth = passport.authenticate('jwt', { session: false });

const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app){
    //request GET, pasa primero por requireAuth y despues si se resuelve ejecuta el callback (request handler)  
    app.get('/', requireAuth, function(req, res){
        res.send({foo: 'bar'});
    });
    
    //request POST
    app.post('/signup', Authentication.signup)
    
    //Signin
    app.post('/signin', requireSignin, Authentication.signin)

}