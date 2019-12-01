/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const { Schema } = mongoose;
const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, require: true },
    age: { type: Number },
    sex: { type: String },
    address: { type: String },
    degree: { type: String },
    phone: { type: Number },
    url: { type: String },
    passwordHash: { type: String, require: true },
    googleId: { type: String },
    facebookId: { type: String },
});

UserSchema.methods.setPassword = (password) => {
    this.passwordHash = bcrypt.hashSync(password, saltRounds);
};

UserSchema.methods.validatePassword = (password) => bcrypt.compareSync(password, this.passwordHash);

UserSchema.methods.generateJWT = () => {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, process.env.JWT_KEY);
};

UserSchema.methods.toAuthJSON = () => ({ username: this.username, token: this.generateJWT() });
module.exports = mongoose.model('User', UserSchema);
