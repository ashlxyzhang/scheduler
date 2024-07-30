const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const notifier = require("node-notifier");

const app = express();
const regex = /<td\s+CLASS="dddefault">(\d+)<\/td>/gi;

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
      notifier.notify({
        title: "Course open!!!",
        message: "Tyagi's CSCE 312 has an open spot.",
        sound: true,
        wait: false,
        open: "https://tamu.collegescheduler.com/entry",
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

cron.schedule("* * * * *", () => {
  fetchData(57925);
  fetchData(57924);
  fetchData(57923);
});
