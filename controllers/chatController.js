/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
const Chat = require('../models/chats');
const User = require('../models/users');

// req: teacherID, studentID, type
exports.sendChat = async (req, res) => {
  let result = await Chat.find({ studentID: req.body.studentID, teacherID: req.body.teacherID });
  if (!result) {
    result = new Chat({
      teacherID: req.body.teacherID,
      studentID: req.body.studentID,
      content: [{
        time: Date.now(),
        from: req.body.type === 'Người học' ? req.body.studentID : req.body.teacherID,
        content: req.body.content,
      }],
      teacherUnseen: req.body.type === 'Người học' ? 1 : 0,
      studentUnseen: req.body.type === 'Người học' ? 0 : 1,
    });
  } else {
    result.content.push({
      time: Date.now(),
      from: req.body.type === 'Người học' ? req.body.studentID : req.body.teacherID,
      content: req.body.content,
    });
    result.teacherUnseen += req.body.type === 'Người học' ? 1 : 0;
    result.studentUnseen += req.body.type === 'Người học' ? 0 : 1;
  }
  await result.save();
  const id = req.body.type === 'Người học' ? req.body.teacherID : req.body.studentID;
  const user = await User.findById(id);
  return res.status(200).send({ chat: result, partner: user });
};
// req.body: studentID,teacherID, type
exports.getChat = async (req, res) => {
  const result = await Chat.find({ studentID: req.body.studentID, teacherID: req.body.teacherID });
  const id = req.body.type === 'Người học' ? req.body.teacherID : req.body.studentID;
  result.teacherUnseen = req.body.type === 'Người học' ? result.teacherUnseen : 0;
  result.studentUnseen = req.body.type === 'Người học' ? 0 : result.studentUnseen;
  const user = await User.findById(id);
  return res.status(200).send({ chat: result, partner: user });
};

// req.body: ID, type
exports.getPartnerList = async (req, res) => {
  let result = [];
  if (req.body.type === 'Người học') {
    result = await Chat.find({ studentID: req.body.ID });
  } else {
    result = await Chat.find({ teacherID: req.body.ID });
  }
  const user = await User.find();
  const partner = req.body.type === 'Người học' ? 'TeacherID' : 'StudentID';
  const unseen = req.body.type === 'Người học' ? 'studentUnseen' : 'teacherUnseen';

  const list = result.map((ele) => {
    const elem = user.find((element) => String(element._id) === String(ele[partner]));
    let copy = { partnerID: '', name: '', unseen: '' };
    if (elem) {
      copy = { partnerID: ele[partner], name: elem.username, unseen: ele[unseen] };
    }
    return copy;
  });
  return res.status(200).send({ chat: list });
};
