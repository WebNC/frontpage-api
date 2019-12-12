/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const saltRounds = 10;
const { Schema } = mongoose;
const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, require: true },
    birthday: { type: String },
    major: { type: String },
    skill: { type: Array },
    intro: { type: String },
    sex: { type: String },
    address: { type: Object },
    degree: { type: String },
    phone: { type: String },
    url: { type: String },
    type: { type: String, required: true },
    price: { type: Number },
    successRatio: { type: Number },
    rating: { type: Number },
    history: { type: Array },
    income: { type: Number },
    passwordHash: { type: String, require: true },
    googleId: { type: String },
    facebookId: { type: String },
    isBlocked: { type: Boolean, default: false },
    isActived: { type: Boolean, default: false },
});

UserSchema.methods.setPassword = function (password) {
    this.passwordHash = bcrypt.hashSync(password, saltRounds);
};

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, process.env.JWT_KEY);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        id: this._id,
        username: this.username,
        type: this.type,
        token: this.generateJWT(),
    };
};
module.exports = mongoose.model('User', UserSchema);
