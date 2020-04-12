var express = require("express");
var notificationRoutes = express.Router();
var Notification = require("../models/notification");
const app = express();

/**
 * Add new notification
 */
notificationRoutes.route("/add").post(function (req, res) {
  var notification = new Notification(req.body);

  notification
    .save()
    .then((item) => {
      res.status(200).json({ item });
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});

/**
 * Delete notification from database based on its Id
 */
notificationRoutes.route("/:id").delete(function (req, res) {
  Notification.findByIdAndRemove({ _id: req.params.id }, function (
    err,
    notification
  ) {
    if (err) res.status(400).json(err);
    else res.status(200).json("Successfully removed");
  });
});

/**
 * Read notifications of a customer (limited to 10)
 * from a specified time (the latest notifications are at the top)
 */
notificationRoutes.route("/customer/:id/:fromTime").get(function (req, res) {
  var customerId = req.params.id;
  var extractedId = req.id;

  var date = req.params.fromTime || Date.now();

  if (extractedId != customerId) {
    res.status(401).send("Unauthorized user");
    return;
  }

  Notification.find({ customerId: customerId, createdAt: { $lt: date } })
    .sort({ createdAt: -1 })
    .limit(10)
    .exec(function (err, notification) {
      if (err) {
        console.log(err);
        res.status(400).json("An error occurs!");
        return;
      }
      res.status(200).json(notification);
    });
});

/**
 * Read notifications of a vendor (limited to 10)
 * from a specified time (the latest notifications are at the top)
 */
notificationRoutes.route("/vendor/:id/:fromTime").get(function (req, res) {
  var vendorId = req.params.id;
  var extractedId = req.id;

  if (extractedId != vendorId) {
    res.status(401).send("Unauthorized user");
    return;
  }

  var date = req.params.fromTime || Date.now();

  Notification.find({ vendorId: vendorId, createdAt: { $lt: date } })
    .sort({ createdAt: -1 })
    .limit(10)
    .exec(function (err, notification) {
      if (err) {
        console.log(err);
        res.status(400).json("An error occurs!");
        return;
      }
      res.status(200).json(notification);
    });
});

/**
 * Read notifications of a pet (limited to 10)
 * from a specified time (the latest notifications are at the top)
 */
notificationRoutes.route("/pet/:id/:fromTime").get(function (req, res) {
  var petId = req.params.id;
  var extractedId = req.id;
  var date = req.params.fromTime || Date.now();

    if (extractedId != petId) {
      res.status(401).send("Unauthorized user");
      return;
    }

  Notification.find({ petId: petId, createdAt: { $lt: date } })
    .sort({ createdAt: -1 })
    .limit(10)
    .exec(function (err, notification) {
      if (err) {
        console.log(err);
        res.status(400).json("An error occurs!");
        return;
      }
      res.status(200).json(notification);
    });
});

/**
 * Read a notification by its Id
 */
notificationRoutes.route("/:id").get(function (req, res) {
  Notification.findById({ _id: req.params.id }, function (err, notification) {
    if (err) res.status(400).json(err);
    else res.status(200).json(notification);
  });
});
module.exports = notificationRoutes;
