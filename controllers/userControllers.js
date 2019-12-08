/* eslint-disable eqeqeq */
/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
const passport = require('passport');
const User = require('../models/users');
const Skill = require('../models/skills');

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
          message: 'Tài khoản bị khóa.',
        });
      } else {
        res.json({ user: user.toAuthJSON() });
      }
      return res;
    }
    return res.status(400).send({
      message: 'Some thing went wrong.',
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

exports.resgiterTeacher = (req, res) => {
  const { id } = req.body;
  User.findOne({ _id: id })
    .then((user) => {
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
        // write something
        newUser.save();
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
      // eslint-disable-next-line no-underscore-dangle
      const ele = skillL.find((elem) => elem._id == element);
      return ele.name;
    });
    res.send(userList);
  }
  return res;
};

exports.getSkill = async (req, res) => {
  const skill = await Skill.find({ isDeleted: false });
  return res.status(200).send({
    message: skill,
  });
};


exports.upload = (req, res) => {
  const { id } = req.payload;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400);
      }
      user.url = req.file.url;
      user.save();
      return res.send(user.url);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while update the User.',
      });
    });
};
