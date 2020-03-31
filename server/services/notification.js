var admin = require("firebase-admin");
const { Expo } = require('expo-server-sdk')
var serviceAccount = require("../../fcm.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://petapp-11e4f.firebaseio.com"
});

var notification = {};

notification.send = async (somePushTokens) => {
    // var payload = {
    //     notification: {
    //       title: "Account Deposit",
    //       body: "A deposit to your savings account has just cleared."
    //     }
    // };

    // admin.messaging().sendToDevice(deviceId, payload)
    //     .then((res) => {
    //         console.log("Successfully sent message:", res);
    //     })
    //     .catch((err) => {
    //         console.log("Error sending message:", err);
    //     });
    let expo = new Expo();
    let messages = [];
    for (let pushToken of somePushTokens) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
        
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
        
        // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications)
        messages.push({
            to: pushToken,
            sound: 'default',
            body: 'If a ticket contains an error code in ticket.details.error, you must handle it appropriately'
        })
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    console.log(chunks);
    for (let chunk of chunks) {
        try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
        } catch (error) {
        console.error(error);
        }
    }
}

module.exports = notification;