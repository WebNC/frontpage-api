/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const Contract = require('../models/contracts');
const Report = require('../models/reports');
const Teacher = require('../models/users');

exports.requestContract = async (req, res) => {
  const contractM = new Contract({
    studentID: req.body.studentID,
    teacherID: req.body.teacherID,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    hour: req.body.hour,
    skill: req.body.skill,
    value: req.body.value,
    address: req.body.address,
  });
  try {
    await contractM.save();
    res.status(200).send({
      contract: contractM,
    });
  } catch (err) {
    res.status(500).send({
      message: 'Server error',
    });
  }
};
exports.editContract = async (req, res) => {
  const { id } = req.body;
  const result = await Contract.findById(id);
  if (result) {
    result.fromDate = req.body.fromDate || result.fromDate;
    result.toDate = req.body.toDate || result.toDate;
    result.hour = req.body.hour || result.hour;
    result.skill = req.body.skill || result.skill;
    result.value = req.body.value || result.value;
    result.address = req.body.address || result.address;
    await result.save();
    res.status(200).send({
      contract: result,
    });
  } else {
    res.status(500).send({
      message: 'Cannot find contract',
    });
  }
  return res;
};

exports.evaluateContract = async (req, res) => {
  const { id } = req.body;
  const result = await Contract.findById(id);
  if (result) {
    result.comment = { id, date: new Date(), comment: req.body.comment };
    result.rating = req.body.rating || result.rating;
    await result.save();
    res.status(200).send({
      contract: result,
    });
  } else {
    res.status(500).send({
      message: 'Không tìm thấy hợp đồng',
    });
  }
  return res;
};
// exports.ratingContract = async (req, res) => {
//   const { id } = req.body;
//   const result = await Contract.findById(id);
//   if (result) {
//     result.rating = req.body.rating || result.rating;
//     await result.save();
//     res.status(200).send({
//       contract: result,
//     });
//   } else {
//     res.status(500).send({
//       message: 'Cannot find contract',
//     });
//   }
//   return res;
// };
exports.deleteContract = async (req, res) => {
  const { id } = req.body;
  const result = await Contract.findById(id);
  if (result) {
    result.isDeleted = true;
    await result.save();
    res.status(200).send({
      message: 'done',
    });
  } else {
    res.status(500).send({
      message: 'Cannot find contract',
    });
  }
  return res;
};

exports.reportContract = async (req, res) => {
  const report = new Report({
    teacherID: req.body.teacherID,
    studentID: req.body.studentID,
    content: req.body.content,
  });
  try {
    await report.save();
    res.status(200).send({
      message: 'done',
    });
  } catch (err) {
    res.status(500).send({
      message: 'Server error',
    });
  }
};
// exports.chatStudent = (req, res) => {

// };

exports.getStudentContract = async (id) => {
  const contractList = await Contract.find({ studentID: id });
  const teacherList = await Teacher.find({ type: 'Người dạy' });
  const list = contractList.map((element) => {
    const elem = teacherList.find((ele) => String(element.teacherID) == String(ele._id));
    let copy = {};
    if (elem) {
      copy = { ...element.toObject(), teacherName: elem.username };
    } else {
      copy = element.toObject();
    }
    return copy;
  });
  return list;
};

exports.payment = async (req, res) => {
  const { id } = req.body;
  const result = await Contract.findById(id);
  if (result) {
    result.statusPay = true;
    result.status = 'Đã thanh toán';
    result.payDate = new Date();
    await result.save();
    res.status(200).send({
      contract: result,
    });
  } else {
    res.status(500).send({
      message: 'Không tìm thấy hợp đồng',
    });
  }
  return res;
};
