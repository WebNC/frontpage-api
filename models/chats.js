/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const ReportSchema = new Schema({
    teacherID: { type: Schema.Types.ObjectId, required: true },
    studentID: { type: Schema.Types.ObjectId, required: true },
    // { time: Date,from: ObjectID, content: String}
    content: { type: Array },
    teacherUnseen: { type: Number, default: 0 },
    studentUnseen: { type: Number, default: 0 },
    lastUpdate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', ReportSchema);
