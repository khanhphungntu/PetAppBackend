var express = require("express");
var notificationRoutes = express.Router();
var Notification = require("../models/notification");
const app = express();

// add new notification
notificationRoutes.route("/add").post(function(req, res) {
  var notification = new Notification(req.body);

  notification
    .save()
    .then(item => {
      res.status(200).json({ item });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// delete notification from database
notificationRoutes.route("/:id").delete(function(req, res) {
  Notification.findByIdAndRemove({ _id: req.params.id }, function(
    err,
    notification
  ) {
    if (err) res.json(err);
    else res.status(200).json("Successfully removed");
  });
});

//read notification of one customer
notificationRoutes.route("/customer/:id/:fromTime").get(function(req, res) {
  var customerId = req.params.id;
  var extractedId = req.id;

  var date = req.params.fromTime || Date.now();

  if (extractedId != customerId) {
    res.status(410).send("Unauthorized user");
    return;
  }

  Notification.find({ customerId: customerId, createdAt: { $lt: date } })
    .sort({ createdAt: -1 })
    .limit(12)
    .exec(function(err, notification) {
      if (err) {
        console.log(err);
        res.status(400).json("An error occurs!");
      }
      res.status(200).json(notification);
    });
});

//read notification of one vendor
notificationRoutes.route("/vendor/:id/:fromTime").get(function(req, res) {
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
    .exec(function(err, notification) {
      if (err) {
        console.log(err);
        res.status(400).json("An error occurs!");
        return;
      }
      res.status(200).json(notification);
    });
});

//read notification of one pet
//will think about the security here
notificationRoutes.route("/pet/:id").get(function(req, res) {
  var petId = req.params.id;
  var extractedId = req.id;
  var date = req.body.date || Date.now();

  //   if (extractedId != petId) {
  //     res.status(401).send("Unauthorized user");
  //     return;
  //   }

  Notification.find({ petId: petId, createdAt: { $lt: date } })
    .sort({ createdAt: -1 })
    .limit(10)
    .exec(function(err, notification) {
      if (err) {
        console.log(err);
        res.status(400).json("An error occurs!");
      }
      res.status(200).json(notification);
    });
});
//read notification by id
notificationRoutes.route("/:id").get(function(req, res) {
  Notification.findById({ _id: req.params.id }, function(err, notification) {
    if (err) res.json(err);
    else res.status(200).json(notification);
  });
});
module.exports = notificationRoutes;
