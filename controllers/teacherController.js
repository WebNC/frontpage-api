/* eslint-disable eqeqeq */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const User = require('../models/users');
const Skill = require('../models/skills');
const Contract = require('../models/contracts');

function compare( a, b ) {
  if ( a.createAt < b.createAt ) {
    return 1;
  }
  if ( a.createAt > b.createAt ) {
    return -1;
  }
  return 0;
}

exports.getAllUserTeacher = async (req, res) => {
  const { page } = req.params;
  const pageSize = 10;
  const teacherL = await User.find({ type: 'Người dạy', isBlocked: false })
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  const contractList = await Contract.find();
  const teachers = teacherL.map((element) => {
    const elem = contractList.filter((ele) => (String(element._id) == String(ele.teacherID) && ele.status == 'Đã hoàn thành'));
    let copy = {};
    if (elem) {
      copy = { ...element.toObject(), numJob: elem.length };
    } else {
      // copy = element.toObject();
      copy = { ...element.toObject(), numJob: 0 };
    }
    return copy;
  });
  
  return res.status(200).send({
    message: teachers,
  });
};
exports.getNumberUserTeacher = async (req, res) => {
  const num = await User.countDocuments({ type: 'Người dạy', isBlocked: false });
  return res.status(200).send({
    message: num,
  });
};
exports.getTeacherRatio = async (id) => {
  // const contractList = await Contract.find({ teacherID: id, isDeleted: false });
  const contractList = await Contract.find({ teacherID: id });
  // const completeList = contractList.filter((ele) => ele.status === 'Đã hoàn thành');
  // const successList = contractList.filter((ele) => (ele.status !== 'Đang chờ' && ele.status !== 'Từ chối'));
  const completeList = contractList.filter((ele) => (ele.status === 'Đã hoàn thành' || ele.status === 'Đã hoàn tiền'));
  const successList = contractList.filter((ele) => ele.status === 'Đã hoàn thành');
  let successRatio = contractList.length != 0
    ? (successList.length / completeList.length) * 100 : 100;
  let sum = 0;
  completeList.forEach((element) => {
    sum += element.rating;
  });
  successRatio = Math.round(successRatio * 100) / 100;
  let rating = completeList.length != 0 ? (sum / completeList.length) : 5;
  rating = Math.round(rating * 100) / 100;
  const teacherList = await User.find({ type: 'Người học' });
  const contracts = contractList.map((element) => {
    const elem = teacherList.find((ele) => String(element.studentID) == String(ele._id));
    let copy = {};
    if (elem) {
      copy = { ...element.toObject(), studentName: elem.username };
    } else {
      copy = element.toObject();
    }
    return copy;
  });
  const history = contracts.sort(compare);
  return {
    successRatio,
    rating,
    history,
  };
};

exports.getDetailTeacher = async (req, res) => {
  const { id } = req.params;
  const teacher = await User.findById(id);
  const result = await this.getTeacherRatio(id);
  teacher.successRatio = result.successRatio;
  teacher.rating = result.rating;
  await teacher.save();
  teacher.history = result.history.filter((ele) => ele.status === 'Đã hoàn thành');
  teacher.passwordHash = null;
  const skillL = await Skill.find();
  const teacherList = teacher.skill.map((element) => {
    const ele = skillL.find((elem) => String(elem._id) == String(element));
    return { id: ele._id, name: ele.name };
  });
  teacher.skill = teacherList;
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
      await user.save();
      const skillL = await Skill.find();
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
    .then(async (user) => {
      if (!user) {
        return res.sendStatus(400);
      }
      user.intro = intro || user.intro;
      await user.save();
      const skillL = await Skill.find();
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

exports.editMajorSkill = (req, res) => {
  const {
    id,
    major,
    skill,
  } = req.body;
  return User.findById(id)
    .then(async (user) => {
      if (!user) {
        return res.sendStatus(400);
      }
      user.major = major || user.major;
      user.skill = skill || user.skill;
      await user.save();
      const skillL = await Skill.find();
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
  const user = await User.find({ type: 'Người dạy', isBlocked: false });
  const result = user.filter((ele) => (local && ele.address ? ele.address.district === local : true)
    && (type && ele.price ? checkPrice(ele.price, type) : true)
    && (skill && ele.skill ? ele.skill.includes(skill) : true));
  res.status(200).send({
    user: result,
  });
};


exports.contractsAccept = async (req, res) => {
  const { id, status } = req.body;
  const result = await Contract.findById(id);
  if (result) {
    if (status == 'Từ chối') {
      result.status = 'Từ chối';
      await result.save();
      res.status(200).send({
        message: 'Đã từ chối hợp đồng',
      });
    } else {
      result.status = 'Đã chấp nhận';
      await result.save();
      res.status(200).send({
        message: 'Đã chấp nhận hợp đồng',
      });
    }
  } else {
    res.status(500).send({
      message: 'Cannot find contract',
    });
  }
  return res;
};


exports.getIncomeData = async (req, res) => {
  const { id } = req.params;
  const data = [];
  for (let i = 0; i < 12; i += 1) {
    data.push({ month: `Tháng ${i + 1}`, income: 0 });
  }
  const date = new Date();
  const contract = await Contract.find({ $or: [{ status: 'Đã hoàn thành' }, { status: 'Đang giải quyết' }], teacherID: id });
  contract.forEach((ele) => {
    if (ele.payDate.getYear() === date.getYear()) {
      data[ele.payDate.getMonth()].income += (ele.value / 1000000);
    }
  });
  res.status(200).send({ data });
};
