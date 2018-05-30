const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;


// Define our model
const userSchema = new Schema({
    email: { 
        type: String, 
        unique: true, 
        lowercase: true //convierte a lowercae todo lo que le entra
    },
    password: String
});

// on SaveHook, encrypt password
//Antes de guardar el modelo, ejecutar esta funcion
userSchema.pre('save', function(next){
    // obtener acceso al modelo de usuario
    const user = this;

    //general un salt
    bcrypt.genSalt(10, function(err, salt){
        if (err){ return next(err); }

        //hashear un password en base al salt
        bcrypt.hash(user.password, salt, null, function(err, hash){
            if (err){ return next(err); }

            //asignamos el hash obtenido al nuevo password
            user.password = hash;
            next();
        });
    })
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if (err) { return callback(err); }
        callback(null, isMatch);
    })
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;