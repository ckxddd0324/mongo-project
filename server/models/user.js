const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrpyt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not a valid phone number!`
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required:true
        },
        token:{
            type: String,
            required: true
        }
    }]
});
//override return json

UserSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function(){
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
    console.log('access', access);

    user.tokens = user.tokens.concat([{
        access,
        token
    }]);
    console.log(user.tokens);
    return user.save().then(() => {
        console.log(token);
        return token;
    });
};

UserSchema.methods.removeToken = function(token){
    //remove array in $pull
    let user = this;

    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    });
}

UserSchema.statics.findByToken = function(token){
    //statics call with model
    let User = this;
    let decoded = undefined;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch(e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // })
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

UserSchema.statics.findByCredential = function(email, password){
    let User = this;

    return User.findOne( {email} ).then((user) => {
        if(!user){
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrpyt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user);
                } else {
                    reject()
                }
            })
        })
    })
};

UserSchema.pre('save', function(next){
    let user = this;

    if(user.isModified('password')){
        //user.password
        bcrpyt.genSalt(10, (err, salt) => {
            bcrpyt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next()
            })
        })

        //user.password = hash
        //next();

    }else{
        next();
    }
});

let User = mongoose.model('User', UserSchema);

module.exports = {
    User
}