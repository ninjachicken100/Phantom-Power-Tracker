import nodemailer from 'nodemailer';
import path from 'path';

export default async function handler(req, res) {

  if (req.method === 'POST') {
    const { owner, emailContent } = req.body;

    console.log('Received request to send email');
    console.log('Owner:', owner);
    console.log('Email Content:', emailContent);

    let recipient;

    if (owner === 'dad') {
      recipient = process.env.DAD_EMAIL;
    } else if (owner === 'mom') {
      recipient = process.env.MOM_EMAIL;
    } else if (owner === 'younger brother') {
      recipient = process.env.YOUNGERBRO_EMAIL;
    } else if (owner === 'older brother') {
      recipient = process.env.OLDERBRO_EMAIL;
    } else if (owner === 'parents') {
      recipient = process.env.PARENTS_EMAIL;
    } else {
      console.error('No email address found for owner:', owner);
      res.status(400).json({ message: 'No email address found for owner' });
      return;
    }

    console.log('Recipient:', recipient);

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    console.log('Transporter created');

    // Set up email data
    let mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: recipient, // List of recipients
      subject: 'PhantomPowerTracker', // Subject line
      text: emailContent, // Plain text body
      html: `${emailContent}<br><br><img src="cid:emailLogo" />`, // HTML body with embedded image
      attachments: [
        {
          filename: 'emailLogo.png',
          path: path.join(process.cwd(), 'src/components/emailLogo.png'), // Adjust the path to your image
          cid: 'emailLogo' // Same CID as in the HTML body
        }
      ]
    };

    console.log('Mail options set:', mailOptions);

    try {
      // Send mail with defined transport object
      let info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      res.status(200).json({ message: 'Email sent successfully', info });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}