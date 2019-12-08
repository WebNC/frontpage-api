/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const ReportSchema = new Schema({
    teacherID: { type: Schema.Types.ObjectId, required: true },
    userID: { type: Schema.Types.ObjectId, required: true },
    date: { type: Date },
    // { time: Date, from: Schema.Types.ObjectId ? name, content: String, seen: Boolean}
    content: { type: Array },
});

module.exports = mongoose.model('Report', ReportSchema);
