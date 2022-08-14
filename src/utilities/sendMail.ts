import nodemailer from "nodemailer";
import { MailOptions } from "../types";

export async function sendEmail(mailOptions: MailOptions) {
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // const mailOptions = {
  //   from: '"Fred Foo 👻" <foo@example.com>', // sender address
  //   to: toEmail, // list of receivers
  //   subject: "Change Password | Contractor", // Subject line
  //   text: "Hello world?", // plain text body
  //   html: url, // html body
  // };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
