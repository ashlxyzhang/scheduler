const axios = require("axios");
const cron = require("node-cron");
const mailer = require("nodemailer");
require("dotenv").config();

const regex = /<td\s+CLASS="dddefault">(\d+)<\/td>/gi;

let transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

let mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_REC,
  subject: "Course open!!!",
  text: "Tyagi's CSCE 312 has an open spot. https://tamu.collegescheduler.com/entry",
};

const fetchData = async (crn) => {
  try {
    const res = await axios.get(
      `https://compass-ssb.tamu.edu/pls/PROD/bwykschd.p_disp_detail_sched?term_in=202431&crn_in=${crn}`
    );
    const html = res.data;
    const matches = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
      matches.push(match[1]); // Extract the number
    }
    console.log(crn, ":", matches);

    if (matches[matches.length - 1] != "0") {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

cron.schedule("* * * * *", () => {
  fetchData(57925);
  fetchData(57924);
  fetchData(57923);
});
