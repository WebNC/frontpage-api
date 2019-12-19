/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const ReportSchema = new Schema({
    teacherID: { type: Schema.Types.ObjectId, required: true },
    studentID: { type: Schema.Types.ObjectId, required: true },
    teacherName: { type: String },
    studentName: { type: String },
    date: { type: Date, default: Date.now() },
    content: { type: String },
    // solved, unsolve
    status: { type: Boolean, default: false },
});

module.exports = mongoose.model('Report', ReportSchema);
