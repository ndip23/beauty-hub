const nodemailer = require("nodemailer");

const sendVerificationEmail = async (
  email,
  link,
  {
    subject = "Verify your email address",
    title = "Email Verification",
    message = "Click below to verify your account:",
    buttonText = "Verify Email",
  } = {}
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`DEV MODE: Email to ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Click this link: ${link}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: `"Beauty Hub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <h2>${title}</h2>
      <p>${message}</p>
      <a href="${link}" style="background:#000;color:#fff;padding:10px 15px;border-radius:5px;text-decoration:none;">
         ${buttonText}
      </a>
      <p>If button doesn't work, copy and paste this URL:</p>
      <p>${link}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
