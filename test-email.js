const nodemailer = require('nodemailer');

(async () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'tahfimibnkhan123@gmail.com',
      pass: 'egozavsvsytxaoeg',
    },
    family: 4, // Force IPv4
  });

  try {
    const info = await transporter.sendMail({
      from: '"FreshBasket" <tahfimibnkhan123@gmail.com>',
      to: 'tahfimibnkhan123@gmail.com',
      subject: 'Test Email from FreshBasket',
      text: 'This is a test email sent using Gmail SMTP.',
    });

    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.error('Error sending email:', err);
  }
})();
