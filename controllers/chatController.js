/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
const Chat = require('../models/chats');
const User = require('../models/users');

// const sortDate = (a, b) => {
//   return a.lastUpdate < b.lastUpdate || a.content.length !== 0;
// };
// req: teacherID, studentID, type
exports.sendChat = async (req, res) => {
  let result = await Chat.find({ studentID: req.body.studentID, teacherID: req.body.teacherID });
  if (result.length === 0) {
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
    result[0].content.push({
      time: Date.now(),
      from: req.body.type === 'Người học' ? req.body.studentID : req.body.teacherID,
      content: req.body.content,
    });
    result[0].teacherUnseen += req.body.type === 'Người học' ? 1 : 0;
    result[0].studentUnseen += req.body.type === 'Người học' ? 0 : 1;
  }
  result[0].lastUpdate = Date.now();
  await result[0].save();
  const result1 = await Chat.find({ studentID: req.body.studentID, teacherID: req.body.teacherID });
  return res.status(200).send({ chat: result1 });
};
// req.body: studentID,teacherID, type
exports.getChat = async (req, res) => {
  const result = await Chat.find({ studentID: req.body.studentID, teacherID: req.body.teacherID });
  const id = req.body.type === 'Người học' ? req.body.teacherID : req.body.studentID;
  result[0].teacherUnseen = req.body.type === 'Người học' ? result[0].teacherUnseen : 0;
  result[0].studentUnseen = req.body.type === 'Người học' ? 0 : result[0].studentUnseen;
  await result[0].save();
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
  const partner = req.body.type === 'Người học' ? 'teacherID' : 'studentID';
  const unseen = req.body.type === 'Người học' ? 'studentUnseen' : 'teacherUnseen';
  // result.sort(sortDate);
  const list = result.map((ele) => {
    const elem = user.find((element) => String(element._id) === String(ele[partner]));
    let copy = {
      partnerID: '',
      name: '',
      unseen: '',
      avatar: '',
    };
    if (elem) {
      copy = {
        partnerID: ele[partner],
        name: elem.username,
        unseen: ele[unseen],
        avatar: elem.url,
      };
    }
    return copy;
  });
  return res.status(200).send({ chat: list });
};

exports.createRoom = async (req, res) => {
  let room = await Chat.find({ teacherID: req.body.teacherID, studentID: req.body.studentID });
  if (room.length === 0) {
    room = new Chat({
      teacherID: req.body.teacherID,
      studentID: req.body.studentID,
    });
    await room.save();
    res.status(200).send({ chat: room });
  }
  return res;
};
