import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

// const transporter = nodemailer.createTransport({
//     host:'smtp-relay.brevo.com',
//     port: 587,
//     auth:{
//         user: process.env.SMTP_USER,
//         password: process.env.SMTP_PASSWORD,

//     }
    
// });


// export default transporter;

// const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export default transporter;