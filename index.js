
const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const env = require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);


const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:`${process.env.EMAIL}`,
    pass:`${process.env.PASS}`,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

app.get('/', function (req, res) {
  res.send('hello world')
})

app.post("/contact", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message; 
  const mail = {
    from: name,
    to: `${process.env.EMAIL}`,
    subject: "Contact Form Message",
    html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      console.log(error);
      res.json({ mail });
    } else {
      res.json({ status: "Message Sent" });
    }
  });
});
app.listen(process.env.PORT || 5000, () => console.log("Server Running"));