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
    address: { type: Object },
    hour: { type: Number },
    skill: { type: Array },
    // Đang chờ, Bị từ chối, Chấp nhận
    status: { type: String, default: 'Đang chờ' },
    // Đã thanh toán, chưa thanh toán
    statusPay: { type: Boolean, default: false },
    rating: { type: Number, default: 5 },
    // Object {id,date,comment}
    comment: { type: Object },
    value: { type: Number },
    isDeleted: { type: Boolean, default: false },
    createAt: { type: Date, default: Date.now() },
    payDate: { type: Date },
});

module.exports = mongoose.model('Contract', ContractSchema);
