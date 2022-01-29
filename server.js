require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

//Config Mailgun
const mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const app = express();
app.use(formidable());
app.use(cors());

//Route de l'envoi du mail
app.post("/form", (req, res) => {
  const data = {
    from: `${req.fields.firstname} ${req.fields.lastname} <${req.fields.email}>`,
    to: `${process.env.MAILGUN_EMAIL}`,
    subject: "Formulaire JS-Tripadvisor",
    text: req.fields.message,
  };
  console.log(req.fields);

  //fonction mailgun pour la creation et l'envoi d'email
  mailgun.messages().send(data, (error, body) => {
    if (error === undefined) {
      res.json({ message: "Formulaire bien recçu, mail envoyé" });
    } else {
      res.json([error, body]);
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server started 🚀");
});
