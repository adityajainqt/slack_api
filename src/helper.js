const axios = require("axios");
const inquirer = require("inquirer");
const Configstore = require("configstore");
const config = new Configstore("slack-cli");

const apiUrl = "https://slack.com/api";

/******* Below function is used for ask to send message? ********/
async function asktoSendMessage() {
  return inquirer
    .prompt([
      {
        name: "sendMsg",
        type: "confirm",
        message: "Do you want to Send Message?",
      },
    ]);
}

/********* Below function is used for fetch the User List from SLACK API ***********/
async function fetchUserList() {
  const slackToken = config.get("slackToken");
  if (!slackToken) {
    return Promise.reject('No token provided1');
  }
  const url = `${apiUrl}/users.list`;
  return await axios.post(url, {
    token: slackToken
  }, { headers: { authorization: `Bearer ${slackToken}` } });
}

/************* Below function is used for ask to select User? */
async function askToSelectUser(usersList) {
  return inquirer
    .prompt([
      {
        name: "select_user",
        type: "list",
        message: "Please Select User:",
        choices: usersList,
      },
      {
        name: "message",
        type: "input",
        message: "Please write the message?"
      }
    ]);
}

/************* Below function is used for Send Message to User */
async function sendMessage(sendUserDetails, answer) {
  const slackToken = config.get("slackToken");
  if (!slackToken) {
    return Promise.reject('No token provided');
  }
  const url = `${apiUrl}/chat.postMessage`;
  return axios.post(url, {
    channel: sendUserDetails.id,
    as_user: true,
    text: answer.message,
    username: "Khushal"
  }, { headers: { authorization: `Bearer ${slackToken}` } });
}

module.exports = {
  asktoSendMessage,
  fetchUserList,
  askToSelectUser,
  sendMessage
}
