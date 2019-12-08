/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const ReportSchema = new Schema({
    reportID: { type: Schema.Types.ObjectId, required: true },
    userID: { type: Schema.Types.ObjectId, required: true },
    date: { type: Date },
    content: { type: String },
    // solved, unsolve
    status: { type: Boolean },
});

module.exports = mongoose.model('Report', ReportSchema);
