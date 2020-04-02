var admin = require("firebase-admin");
const { Expo } = require('expo-server-sdk')
var serviceAccount = require("../../fcm.json");
// var Pet = require("../models/pet");
// var Customer = require("../models/customer");
// var ServiceNotification = require("../models/serviceNotification");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://petapp-11e4f.firebaseio.com"
});

var notification = {};
send = async (somePushTokens,notif) => {
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
            body: notif
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
notification.send = send

// notification.sendByNotif = (notif)=>{
    
//     console.log(1);
//     Pet.findById(notif.petId, (err, pet) => {
//       if (!err) {
//         Customer.findById(notif.customerId, (err, customer) => {
//           if (!err) {
//             console.log(2);
//             let time = new Date(notif.time);
//             month = time.getMonth() + 1;
//             year = time.getFullYear();
//             date = time.getDate();
//             notifCustomer =
//               "Your booking for pet " +
//               pet.name +
//               " on " +
//               date +
//               "-" +
//               month +
//               "-" +
//               year +
//               "is booked";
//             notifVendor =
//               "Your booking with " +
//               customer.firstName +
//               " " +
//               customer.lastName +
//               " on " +
//               date +
//               "-" +
//               month +
//               "-" +
//               year +
//               "is booked";
//             ServiceNotification.findOne(
//               { userId: customer._id },
//               (err, serNotifCustomer) => {
//                 if (!err) {
//                   console.log(3);
//                   console.log(serNotifCustomer.deviceId);
//                   for (let deviceId of serNotifCustomer.deviceId) {
//                     console.log(deviceId);
//                     send([deviceId], notifCustomer);
//                   }
//                   ServiceNotification.findOne(
//                     { userId: notif.vendorId },
//                     (err, serNotifVendor) => {
//                       if (!err) {
//                         console.log(4);
//                         console.log(notif.vendorId);
//                         console.log(serNotifVendor);
//                         for (let deviceId of serNotifVendor.deviceId) {
//                           console.log(deviceId);
//                           send([deviceId], notifVendor);
//                         }
//                         res
//                           .status(200)
//                           .send("all of the stuff is done\n" + { item });
//                       }
//                     }
//                   );
//                 }
//               }
//             );
//           }
//         });
//       }
//     });
// }

module.exports = notification;