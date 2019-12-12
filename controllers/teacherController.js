/* eslint-disable eqeqeq */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const User = require('../models/users');
const Skill = require('../models/skills');
const Contract = require('../models/contracts');

exports.getAllUserTeacher = async (req, res) => {
  const { page } = req.params;
  const pageSize = 25;
  const teacherL = await User.find({ type: 'Người dạy', isBlocked: false })
    .skip(page * pageSize)
    .limit(pageSize);
  return res.status(200).send({
    message: teacherL,
  });
};
exports.getNumberUserTeacher = async (req, res) => {
  const num = await User.count({ type: 'Người dạy', isBlocked: false });
  return res.status(200).send({
    message: num,
  });
};
exports.getTeacherRatio = async (id) => {
  const contractList = await Contract.find({ teacherID: id });
  const successList = contractList.filter((ele) => ele.status === 'Thành công');
  const successRatio = contractList.length != 0
    ? (successList.length / contractList.length) * 100 : 0;
  let sum = 0;
  contractList.forEach((element) => {
    sum += element.rating;
  });

  let income = 0;
  const payList = successList.filter((ele) => ele.statusPay === true);
  payList.forEach((ele) => {
    income += ele.value;
  });
  const rating = contractList.length != 0 ? (sum / contractList.length) : 5;
  const history = contractList;
  return [successRatio, rating, history, income];
};

exports.getDetailTeacher = async (req, res) => {
  const { id } = req.params;
  const teacher = await User.findById(id);
  teacher.passwordHash = null;
  const skillL = await Skill.find({ isDeleted: false });
  const teacherList = teacher.skill.map((element) => {
    const ele = skillL.find((elem) => elem._id == element);
    return { id: ele._id, name: ele.name };
  });
  teacher.skill = teacherList;
  const [successRatio, rating, history] = this.getTeacherRatio(id);
  teacher.successRatio = successRatio;
  teacher.rating = rating;
  teacher.history = history.filter((ele) => ele.status === 'Thành công');
  return res.status(200).send({
    message: teacher,
  });
};


exports.editInfo = (req, res) => {
  const {
    id,
    username,
    email,
    phone,
    birthday,
    sex,
    price,
  } = req.body;
  return User.findById(id)
    .then(async (user) => {
      if (!user) {
        return res.sendStatus(400);
      }
      user.email = email || user.email;
      user.birthday = birthday || user.birthday;
      user.username = username || user.username;
      user.phone = phone || user.phone;
      user.sex = sex || user.sex;
      user.price = price || user.price;
      user.save();
      const skillL = await Skill.find({ isDeleted: false });
      const userList = user.skill.map((element) => {
        const ele = skillL.find((elem) => elem._id == element);
        return { id: ele._id, name: ele.name };
      });
      user.skill = userList;
      return res.send(user);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while update the User.',
      });
    });
};


exports.editIntro = (req, res) => {
  const {
    id,
    intro,
  } = req.body;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400);
      }
      user.intro = intro || user.intro;
      user.save();
      return res.send(user);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while update the User.',
      });
    });
};

exports.editMajorSkill = (req, res) => {
  const {
    id,
    major,
    skill,
  } = req.body;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400);
      }
      user.major = major || user.major;
      user.skill = skill || user.skill;
      user.save();
      return res.send(user);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while update the User.',
      });
    });
};
const checkPrice = (price, type) => {
  switch (type) {
    case 1:
      return price < 100000;
    case 2:
      return (price >= 100000) && (price < 500000);
    case 3:
      return price >= 500000;
    default:
      return false;
  }
};

exports.filterTeacher = async (req, res) => {
  const { local, type, skill } = req.body;
  const user = await User.find({ type: 'Người dạy' });
  const result = user.filter((ele) => (local ? ele.address.district === local : true)
    && (type ? checkPrice(ele.price, type) : true)
    && (skill ? ele.skill.include(skill) : true));
  res.status(200).send({
    user: result,
  });
};


exports.contractsAccept = async (req, res) => {
  const { id, status } = req.body.status;
  const result = await Contract.findById(id);
  if (result) {
    if (status == 'Từ chối') {
      result.status = 'Từ chối';
    } else {
      result.status = 'Thành công';
    }
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
