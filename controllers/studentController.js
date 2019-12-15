/* eslint-disable linebreak-style */
const Contract = require('../models/contracts');
const Report = require('../models/reports');

exports.requestContract = async (req, res) => {
  console.log(res.body);
  const contractM = new Contract({
    studentID: req.body.studentID,
    teacherID: req.body.teacherID,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    hour: req.body.hour,
    skill: req.body.skill,
    value: req.body.value,
    address: req.body.address,
    isDeleted: false,
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
exports.readContract = async (req, res) => {
  const { id } = req.params;
  const result = await Contract.findById(id);
  if (result) {
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
exports.commentContract = async (req, res) => {
  const { id } = req.body;
  const result = await Contract.findById(id);
  if (result) {
    result.comment.push({ id, date: Date.now(), comment: req.body.comment });
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
exports.ratingContract = async (req, res) => {
  const { id } = req.body;
  const result = await Contract.findById(id);
  if (result) {
    result.rating = req.body.rating || result.rating;
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
    courseID: req.body.courseID,
    userID: req.body.userID,
    content: req.body.content,
  });
  try {
    await report.save();
    res.status(200).send({
      contract: report,
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
  return contractList;
};

exports.payment = async (req, res) => {
  const { id } = req.body;
  const result = await Contract.find({ _id: id, isDeleted: false });
  if (result) {
    result.statusPay = true;
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
