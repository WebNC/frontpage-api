const nodemailer = require('nodemailer');

const urlFrontend = 'http://localhost:3001';

exports.sendMailActive = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'teammn9@gmail.com',
      pass: 'teammn9123',
    },
  });
  const mailOptions = {
    from: 'teammn9@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Kích hoạt tài khoản', // Subject line
    html: `<p>Vui lòng click vào link <a href=${urlFrontend}/active/${token}>này</a> để kích hoạt tài khoản</p>`, // plain text body
  };
  const result = await transporter.sendMail(mailOptions);
  return result;
};


exports.sendMailForget = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'teammn9@gmail.com',
      pass: 'teammn9123',
    },
  });
  const mailOptions = {
    from: 'teammn9@gmail.com', // sender address
    to: email, // list of receivers
    subject: 'Quên mật khẩu', // Subject line
    html: `<p>Bạn nhận được tin này vì bạn đã yêu cầu đổi mật khẩu. Vui lòng click vào link <a href=${urlFrontend}/forget/${token}>này</a> để thay đồi mật khẩu mới</p>`, // plain text body
  };
  const result = await transporter.sendMail(mailOptions);
  return result;
};
