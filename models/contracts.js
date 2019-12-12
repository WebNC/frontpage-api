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
    skill: { type: Array },
    // Đang chờ, Bị từ chối, Chấp nhận
    status: { type: String, default: 'Đang chờ' },
    // Đã thanh toán, chưa thanh toán
    statusPay: { type: Boolean, default: false },
    rating: { type: Number, default: 5 },
    // Array object {id,date,comment}
    comment: { type: Array },
    value: { type: Number },
    isDeleted: { type: Boolean },
});

module.exports = mongoose.model('Contract', ContractSchema);
