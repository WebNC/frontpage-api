const nodemailer = require('nodemailer');


exports.sendMail = async () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'teammn9@gmail.com',
      pass: 'teammn9123',
    },
  });
  const mailOptions = {
    from: 'teammn9@gmail.com', // sender address
    to: 'minh.jin255@gmail.com', // list of receivers
    subject: 'Subject of your email', // Subject line
    html: '<p>Your html here</p>', // plain text body
  };
  await transporter.sendMail(mailOptions);
};
