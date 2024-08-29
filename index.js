if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

// for parsing data from req.body :
app.use(express.urlencoded({ extended: true }));

// require path :
const path = require("path");

// set view engine :
app.set("view engine", "ejs");

// set path for views folder :
app.set("views", path.join(__dirname, "/views"));

// signup page render route :
app.get("/signup", (req, res) => {
  res.render("./signup.ejs");
});

// generate qr route :
app.post("/qr", (req, res) => {
  let { username } = req.body;

  // verification prrocess :
  const secretCode = speakeasy.generateSecret({
    name: req.body.username,
  });
  console.log(secretCode.ascii);
  // generate qrcodelink :
  qrcode.toDataURL(secretCode.otpauth_url, (err, data) => {
    res.render("./qr.ejs", { data, username, secretCode });
  });
});

app.post("/verify", async (req, res) => {
  let { username, token, secretCodeValue } = req.body;
  // verification :
  let verification = speakeasy.totp.verify({
    secret: req.body.secretCodeValue, // encoding type = ascii and it's value ( qrcode )
    encoding: "ascii",
    token: req.body.token, // in google auth. app token { 6 digits }
  });
  if (verification) {
    res.send(`good , you learned google auth . thankyou .. .`);
  } else {
    res.redirect("/signup");
  }
});

// listening :
app.listen(8080, () => {
  console.log("app is run in 8080 ");
});
