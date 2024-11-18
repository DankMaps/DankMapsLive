// server.js

const express = require('express');
const app = express();
const { Expo } = require('expo-server-sdk');

const expo = new Expo();

app.use(express.json());

app.post('/send-notification', (req, res) => {
  const { expoPushToken, message } = req.body;

  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.error(`Push token ${expoPushToken} is not a valid Expo push token`);
    res.status(400).send('Invalid Expo push token');
    return;
  }

  const messages = [];
  messages.push({
    to: expoPushToken,
    sound: 'default',
    body: message,
    data: { message },
  });

  expo
    .sendPushNotificationsAsync(messages)
    .then(ticket => {
      console.log(ticket);
      res.send('Notification sent successfully');
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error sending notification');
    });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
