const jwt = require('jwt-simple');
const UserModel = require('../models/user');
const config = require('../config');

function tokenForUser(user){
    const ts = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: ts}, config.secret);
}
exports.signup = function(req, res, next){
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password){
        return res.status(422).send({error: 'falta ingresa usuario y/o clave'});
    }
    // ver si usuario existe con ese mail
    UserModel.findOne({ email: email}, function(err, existing){
        if (err){ return next(err); }
        // si ya existe el usuario tirar error
        if (existing){
            return res.status(422).send({error: 'Email is in use'});
        }

        //si no existe crear y guardar el registro
        const user = new UserModel({
            email: email,
            password: password
        });

        user.save(function(err){
            if (err) { return next(err); }

            //responde que el usuario fué creado
            res.json({ token: tokenForUser(user)});
        }); 
        
    });
    
    
    
}
exports.signin = function(req, res, next){
    // en este punto el usuario ya tiene su email y usuario autenticado (ver router.js)
    // necesitamos darles el token
    res.send({ token: tokenForUser(req.user)});

}