var admin = require("firebase-admin");
const { Expo } = require("expo-server-sdk");
var serviceAccount = require("../../fcm.json");
var Pet = require("../models/pet");
var Customer = require("../models/customer");
var ServiceNotification = require("../models/serviceNotification");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://petapp-11e4f.firebaseio.com",
});

var expoPush = {};
/** 
 * Function to send a notifcation (string) to devices
 * @param {array} somePushTokens - this is the list of push token (deviceId)
 * @param {string} notif - this is the notification to be sent
 */
expoSend = async (somePushTokens, notif) => {
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
      sound: "default",
      body: notif,
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  // console.log(chunks);
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      // console.log(ticketChunk);
      tickets.push(...ticketChunk);
      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
    } catch (error) {
      console.error(error);
    }
  }
};

/**
 * Function to send a notification to the devices of customer and vendor
 * @param {Object} notif - this is the notification created
 * @param {next} next - this is the callback function to catch the result
 */
expoPush.sendNotif = (notif, next) => {
  // console.log(1);
  Pet.findById(notif.petId, async (err, pet) => {
    if (err) {
      next(200, "There is an error when finding the pet");
    } else if (!pet) {
      next(400, "There is no pet matching the petId");
    } else {
      var status = 200;
      var log = "successfully";
      Customer.findById(notif.customerId)
        .then(async (customer) => {
          if (!customer) {
            return [400, "There is no customer matching the customer id"];
          } else {
            // console.log(2);
            let time = new Date(notif.time);
            month = time.getMonth() + 1;
            year = time.getFullYear();
            date = time.getDate();
            notifCustomer =
              "Your booking for pet " +
              pet.name +
              " on " +
              date +
              "-" +
              month +
              "-" +
              year +
              " is " +
              notif.bookingStatus;
            notifVendor =
              "Your booking with " +
              customer.firstName +
              " " +
              customer.lastName +
              " on " +
              date +
              "-" +
              month +
              "-" +
              year +
              " is " +
              notif.bookingStatus;
            var listSend = [];
            await ServiceNotification.findOne(
              { userId: customer._id },
              (err, serNotifCustomer) => {
                if (err) {
                  status = 400;
                  log = "error while finding the deviceIds of the customer";
                } else if (!serNotifCustomer) {
                  status = 400;
                  log = "Cannot find the deviceIds of the customer";
                } else {
                  for (let deviceId of serNotifCustomer.deviceId) {
                    listSend.push(expoSend([deviceId], notifCustomer));
                  }
                }
              }
            );
            await ServiceNotification.findOne(
              { userId: notif.vendorId },
              (err, serNotifVendor) => {
                if (err) {
                  status = 400;
                  log = "Error while finding the deviceIds of the vendor";
                } else if (!serNotifVendor) {
                  status = 400;
                  log = "Cannot find the device Ids of the vendor";
                  error = true;
                } else {
                  // console.log(4);
                  for (let deviceId of serNotifVendor.deviceId) {
                    // console.log(deviceId);
                    listSend.push(expoSend([deviceId], notifVendor));
                  }
                }
              }
            );


            await Promise.all(listSend);
            console.log(status, log);
            return [status, log];
          }
        })
        .then((v) => {
          next(v[0], v[1]);
        })
        .catch((err) => {
          next(400, "Error while finding the customer");
        });
    }
  });
};

module.exports = expoPush;
