const nodemailer = require('nodemailer');

const urlFrontend = 'http://localhost:3001';

exports.sendMail = async (email, token) => {
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
