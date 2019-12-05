/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable indent */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const ContractSchema = new Schema({
    studentID: { type: Schema.Types.ObjectId, required: true },
    teacherID: { type: Schema.Types.ObjectId, require: true },
    fromDate: { type: Date },
    toDate: { type: Date },
    hour: { type: Number },
    skill: { type: String },
    // Đang chờ, Bị từ chối, Chấp nhận
    statusAccept: { type: Boolean },
    // Đã thanh toán, chưa thanh toán
    statusPay: { type: Boolean },
    value: { type: Number },
});

module.exports = mongoose.model('Contract', ContractSchema);
