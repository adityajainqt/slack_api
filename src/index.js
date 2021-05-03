
const express = require('express');
const { Server } = require("./server");
const { asktoSendMessage, fetchUserList, askToSelectUser, sendMessage } = require("./helper");

const axios = require('axios');
const Configstore = require('configstore');
const open = require('open');
const config = new Configstore("slack-cli");

const userscope = encodeURIComponent("users:read user:read.email");
const scope = encodeURIComponent("chat:write:bot channels:read chat:write:user users:read");
const redirect = encodeURIComponent("http://localhost:4000/oauth");

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const apiUrl = "https://slack.com/api";

let slackToken = undefined;

/********* Make a connection with Port *********/
const server = new Server().app;
const port = process.env.PORT;

server.listen(port, () => {
  console.log("Welcome to Slack API");
  run().catch(err => console.log(err));
});

/*********** Below function is used for create Authorization Token *********/
async function run() {
  try {
    const app = express();

    let resolve;
    const p = new Promise((_resolve) => {
      resolve = _resolve;
    });

    app.get("/oauth", function (req, res, next) {
      resolve(req.query.code);
    });

    const server = await app.listen(4000);

    if (!config.get("slackToken")) {
      const authApiUrl = apiUrl.split("api")[0];
      open(`${authApiUrl}/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirect}`);

      const code = await p;

      const res = await axios.post(`${apiUrl}/oauth.access`,
        `client_id=${clientId}&client_secret=${clientSecret}&code=${code}&redirect_uri=${redirect}`);

      slackToken = res.data.access_token;

      config.set({ slackToken });
      console.log("Logged in successfully!");
    }

    let answer = await asktoSendMessage();

    if (!answer.sendMsg) {
      console.log("Thank you for using slack api!");
      return;

    }

    let res = await fetchUserList();
    const usersArr = res.data.members.filter(user => (user.is_email_confirmed == true && user.is_admin == false));
    let usersList = usersArr.map(user => { return { "id": user.id, "name": user.name }; });

    answer = await askToSelectUser(usersList);

    const sendUserDetails = usersList.find(userObj => userObj.name === answer.select_user);

    res = await sendMessage(sendUserDetails, answer);

    const messageStatus = res.data.ok ? "Message Sent Successfully!" : "Something Went Wrong!";
    console.log(messageStatus);

  } catch (err) {
    console.error(err);
  }
}
