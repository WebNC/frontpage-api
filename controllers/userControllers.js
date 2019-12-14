/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Skill = require('../models/skills');
const TeacherController = require('./teacherController');
const StudentController = require('./studentController');
const sendMail = require('./maillController');


const sendMailActive = async (idUser, email) => {
  const key = '25698';
  const token = await jwt.sign({ id: idUser }, key);
  sendMail.sendMailActive(email, token);
};

const sendMailForget = async (idUser, email) => {
  const key = '150917';
  const token = await jwt.sign({ id: idUser }, key, { expiresIn: '1h' });
  sendMail.sendMailForget(email, token);
};
exports.register = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: 'Some params is missing.',
    });
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res.status(400).send({ message: 'Email exist' });
      } else {
        const newUser = new User({
          email: req.body.email,
          username: req.body.username,
          type: req.body.type,
        });
        newUser.setPassword(req.body.password);
        newUser.save()
          .then((data) => {
            if (req.body.type == 'Người học') {
              sendMailActive(data._id, data.email);
            }
            res.send({ user: data.toAuthJSON() });
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || 'Some error occurred while creating the User.',
            });
          });
      }
    });
  return true;
};
exports.login = (req, res, next) => {
  if (!req.body.email) {
    return res.status(500).send({
      message: 'Email is require.',
    });
  }

  if (!req.body.password) {
    return res.status(500).send({
      message: 'Password is require.',
    });
  }

  passport.authenticate('local', { session: false }, (err, passportUser) => {
    if (err) {
      return next(err);
    }
    if (passportUser) {
      const user = passportUser;
      if (passportUser.isBlocked) {
        res.status(400).send({
          message: 'Tài khoản đã bị khóa.',
        });
      } else if (!passportUser.isActived) {
        sendMailActive(user._id, user.email);
        res.status(400).send({
          message: 'Tài khoản chưa kích hoạt. Hãy kiểm tra email để kích hoạt.',
        });
      } else {
        res.json({ user: user.toAuthJSON() });
      }
      return res;
    }
    return res.status(400).send({
      message: 'Đã có lỗi xảy ra, vui lòng thử lại!',
    });
  })(req, res, next);
  return true;
};

exports.loginFacebook = (req, res, next) => {
  passport.authenticate('facebook-token', { session: false }, (err, passportUser) => {
    if (err) {
      return next(err);
    }
    if (passportUser) {
      User.findOne({ facebookId: passportUser.id })
        .then((user) => {
          if (!user) {
            user = new User({
              username: passportUser.displayName,
              email: passportUser.emails[0].value,
              facebookId: passportUser.id,
              type: 'Người học',
            });
          } else {
            user.username = passportUser.displayName;
            user.email = passportUser.emails[0].value;
          }
          if (user.isBlocked) {
            res.status(400).send({
              message: 'Tài khoản bị khóa.',
            });
          } else {
            user.save();
            res.json({ user: user.toAuthJSON() });
          }
        });
    } else {
      res.status(400).send({
        message: 'Some thing went wrong.',
      });
    }
    return res;
  })(req, res, next);
  return true;
};

exports.loginGoogle = (req, res, next) => {
  passport.authenticate('google-token', { session: false }, (err, passportUser) => {
    if (err) {
      return next(err);
    }
    if (passportUser) {
      User.findOne({ googleId: passportUser.id })
        .then((user) => {
          if (!user) {
            user = new User({
              username: passportUser.displayName,
              email: passportUser.emails[0].value,
              googleId: passportUser.id,
              type: 'Người học',
            });
          } else {
            user.username = passportUser.displayName;
            user.email = passportUser.emails[0].value;
          }
          if (user.isBlocked) {
            res.status(400).send({
              message: 'Tài khoản bị khóa.',
            });
          } else {
            user.save();
            res.json({ user: user.toAuthJSON() });
          }
        });
    } else {
      res.status(400).send({
        message: 'Some thing went wrong.',
      });
    }
    return res;
  })(req, res, next);
  return true;
};

exports.registerTeacher = (req, res) => {
  const { id } = req.body;
  User.findOne({ _id: id })
    .then(async (user) => {
      if (!user) {
        res.status(400).send({
          message: 'No user',
        });
      } else {
        const newUser = user;
        newUser.phone = req.body.phone;
        newUser.birthday = req.body.birthday;
        newUser.skill = req.body.skill;
        newUser.sex = req.body.sex;
        newUser.major = req.body.major;
        newUser.intro = req.body.intro;
        newUser.address = req.body.address;
        newUser.price = req.body.price;
        // write something
        await newUser.save();
        sendMailActive(newUser._id, newUser.email);
        res.status(200).send({
          message: 'Success',
        });
      }
    });
  return res;
};

exports.me = async (req, res) => {
  const { id } = req.payload;
  const skillL = await Skill.find({ isDeleted: false });
  const user = await User.findById(id);
  if (!user) {
    res.sendStatus(400);
  } else {
    const userList = user.skill.map((element) => {
      const ele = skillL.find((elem) => elem._id == element);
      return { id: ele._id, name: ele.name };
    });
    user.skill = userList;
    if (user.type == 'Người học') {
      const history = StudentController.getStudentContract(user._id);
      user.history = history;
    } else {
      const [successRatio, rating, history, income] = TeacherController.getTeacherRatio(id);
      user.successRatio = successRatio;
      user.rating = rating;
      user.history = history;
      user.income = income;
    }
    res.send(user);
  }
  return res;
};

exports.changePass = (req, res) => {
  const { id } = req.body;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400);
      }
      const passHash = user.setPassword(req.body.password);
      user.passwordHash = passHash || user.passwordHash;
      user.save();
      return res.send(user);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while update the User.',
      });
    });
};

exports.getSkill = async (req, res) => {
  const skill = await Skill.find({ isDeleted: false });
  return res.status(200).send({
    message: skill,
  });
};

exports.upload = (req, res) => {
  const { id } = req.body;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400);
      }
      user.url = req.file.url;
      user.save();
      return res.send(user);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while update the User.',
      });
    });
};

exports.verifiedAccount = async (req, res) => {
  const { token } = req.params;
  const key = '25698';
  jwt.verify(token, key, async (err, decoded) => {
    if (err) {
      res.status(400).send({
        message: 'Đã xảy ra lỗi khi xác thực.',
      });
    } else {
      const user = await User.findById(decoded.id);
      user.isActived = true;
      await user.save();
      res.status(200).send({
        message: 'Tài khoản đã được kích hoạt.',
      });
    }
    return res;
  });
};

exports.verifiedAccountForget = async (req, res) => {
  const { token } = req.params;
  const key = '150917';
  jwt.verify(token, key, async (err, decoded) => {
    if (err) {
      res.status(500).send({
        message: 'Token sai hoặc hết hạn',
      });
    } else {
      res.status(200).send({
        id: decoded.id,
      });
    }
    return res;
  });
};

exports.edit = async (req, res) => {
  const { id } = req.body;
  User.findOne({ _id: id })
    .then(async (user) => {
      if (!user) {
        res.status(400).send({
          message: 'No user',
        });
      } else {
        user.username = req.body.username;
        user.address = req.body.address;
        user.sex = req.body.sex;
        user.phone = req.body.phone;
        user.birthday = req.body.birthday;
        // write something
        await user.save();
        // sendMailActive(newUser._id, newUser.email);
        res.status(200).send({
          user,
        });
      }
    });
  return res;
};

exports.forgetPassword = async (req, res) => {
  const result = await User.findOne({ email: req.body.email });
  if (!result) {
    res.status(400).send({ message: 'Email chưa được đăng ký' });
  } else {
    sendMailForget(result._id, result.email);
    res.status(200).send({ message: 'Email đã được gửi đi' });
  }
};

exports.resetPassword = async (req, res) => {
  const { id, password } = req.body;
  const result = await User.findById(id);
  if (!result) {
    res.status(500).send({ message: 'Không tìm thây id' });
  } else {
    result.password = result.setPassword(password);
    await result.save();
    res.status(200).send({ user: result });
  }
  return res;
};
