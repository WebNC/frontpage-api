const User = require('../models/users');

exports.getAllUserTeacher = async (req, res) => {
  const { page } = req.params;
  const pageSize = 25;
  const list = await User.find({ type: 'Người dạy', isBlocked: false })
    .skip(page * pageSize)
    .limit(pageSize);
  return res.status(200).send({
    message: list,
  });
};
exports.getNumberUserTeacher = async (req, res) => {
  const num = await User.count({ type: 'Người dạy', isBlocked: false });
  return res.status(200).send({
    message: num,
  });
};

exports.getDetailTeacher = async (req, res) => {
  const { id } = req.body;
  const teacher = await User.findById(id);
  teacher.passwordHash = null;
  return res.status(200).send({
    message: teacher,
  });
};
