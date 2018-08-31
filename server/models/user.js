const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
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

let User = mongoose.model('User', UserSchema);

module.exports = {
    User
}