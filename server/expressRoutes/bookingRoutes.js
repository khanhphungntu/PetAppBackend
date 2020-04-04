var express = require("express");
var bookingRoutes = express.Router();
var Booking = require("../models/booking");
var Notification = require("../models/notification");
var Schedule = require("../models/unavailableDate");
var Pet = require("../models/pet");
var Customer = require("../models/customer");
var sendNotif = require("../services/notification");
var ServiceNotification = require("../models/serviceNotification");
//add new booking
bookingRoutes.route("/").post((req, res) => {
  var booking = new Booking(req.body);
  var extractedId = req.id;

  if (extractedId != booking.customerId) {
    console.log(extractedId);
    console.log(booking.customerId);
    res.status(401).send("Unauthorized user");
    return;
  }

  booking
    .save()
    .then((item) => {
      //create new notification when a booking is made
      var notification = new Notification();
      notification.time = item.time;
      notification.petId = item.petId;
      notification.bookingId = item._id;
      notification.vendorId = item.vendorId;
      notification.customerId = item.customerId;
      notification.bookingStatus = "booked";
      notification
        .save()
        .then((notif) => {
          console.log(1);
          Pet.findById(req.body.petId, (err, pet) => {
            if (!err && pet) {
              Customer.findById(req.body.customerId, (err, customer) => {
                if (!err && customer) {
                  console.log(2);
                  let time = new Date(req.body.time);
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
                    "is booked";
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
                    "is booked";
                  ServiceNotification.findOne(
                    { userId: customer._id },
                    (err, serNotifCustomer) => {
                      if (!err && serNotifCustomer) {
                        console.log(3);
                        console.log(serNotifCustomer.deviceId);
                        for (let deviceId of serNotifCustomer.deviceId) {
                          console.log(deviceId);
                          sendNotif.send([deviceId], notifCustomer);
                        }
                        ServiceNotification.findOne(
                          { userId: req.body.vendorId },
                          (err, serNotifVendor) => {
                            if (!err && serNotifVendor) {
                              console.log(4);
                              console.log(req.body.vendorId);
                              console.log(serNotifVendor);
                              for (let deviceId of serNotifVendor.deviceId) {
                                console.log(deviceId);
                                sendNotif.send([deviceId], notifVendor);
                              }
                              res
                                .status(200)
                                .send("all of the stuff is done\n" + { item });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send("Unable to save to database");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Unable to save to database");
    });
});

//query booking of one customer
bookingRoutes.route("/customer/:id").get((req, res) => {
  var customerId = req.params.id;
  var extractedId = req.id;

  if (extractedId != customerId) {
    res.status(401).send("Unauthorized user");
    return;
  }

  Booking.find({ customerId: req.params.id })
  .sort({time:-1})
  .exec( (err, bookings) => {
    if (err) {
      console.log(err);
      res.status(400).send("An error occurs!");
    }
    res.status(200).json(bookings);
  });
});

//query booking of one vendor
bookingRoutes.route("/vendor/:id").get((req, res) => {
  var vendorId = req.params.id;
  var extractedId = req.id;

  if (extractedId != vendorId) {
    res.status(401).send("Unauthorized user");
    return;
  }

  Booking.find({ vendorId: req.params.id }, (err, bookings) => {
    if (err) {
      console.log(err);
      res.status(400).send("An error occurs!");
    }
    res.status(200).json(bookings);
  });
});

//query booking by month of one vendor
bookingRoutes.route("/vendor/time/:id/:from/:to").get((req, res) => {
  var vendorId = req.params.id;
  var extractedId = req.id;
  var fromTime = req.params.from;
  var toTime = req.params.to;

  if (extractedId != vendorId) {
    res.status(401).send("Unauthorized user");
    return;
  }

  Booking.find({ vendorId: vendorId, time: { $gte: fromTime, $lte: toTime } })
    .sort({ time: 1 })
    .exec((err, bookings) => {
      if (err) {
        console.log(err);
        res.status(400).send("Could not load document!");
        return;
      }
      res.status(200).json(bookings);
    });
});

//query booking of one pet
bookingRoutes.route("/pet/:id").get((req, res) => {
  Booking.find({ petId: req.params.id })
    .sort({ createdAt: -1 })
    .exec((err, bookings) => {
      if (err) {
        console.log(err);
        res.status(400).send("An error occurs!");
      }
      res.status(200).json(bookings);
    });
});

//get boooking by id
bookingRoutes.route("/:id").get((req, res) => {
  var id = req.params.id;
  var extractedId = req.id;

  Booking.findById(id, (err, booking) => {
    if (err) {
      console.log(err);
      res.status(400).send("An error occurs!");
    }
    res.status(200).json(booking);
  });
});

//update booking (cancel/complete booking)
//must enter status to set status
bookingRoutes.route("/:id").put((req, res) => {
  var id = req.params.id;
  var extractedId = req.id;

  Booking.findById(id, (err, booking) => {
    if (err || !booking) return res.json(err);
    else {
      if (
        extractedId != req.body.vendorId &&
        extractedId != req.body.customerId
      ) {
        res.status(401).send("Unauthorized user");
        return;
      }

      for (item of Object.keys(req.body)) {
        if (item == "password") {
          continue;
        }
        booking[item] = req.body[item];
      }

      booking
        .save()
        .then((item) => {
          var notification = new Notification();
          notification.time = req.body.time;
          notification.petId = req.body.petId;
          notification.bookingId = id;
          notification.vendorId = req.body.vendorId;
          notification.customerId = req.body.customerId;
          notification.bookingStatus = req.body.status;
          notification
            .save()
            .then((notif) => {
              console.log(1);
              Pet.findById(req.body.petId, (err, pet) => {
                if (!err && pet) {
                  Customer.findById(req.body.customerId, (err, customer) => {
                    if (!err && customer) {
                      console.log(2);
                      let time = new Date(req.body.time);
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
                        "is " +
                        req.body.status;
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
                        req.body.status;
                      ServiceNotification.findOne(
                        { userId: customer._id },
                        (err, serNotifCustomer) => {
                          if (!err && serNotifCustomer) {
                            console.log(3);
                            console.log(serNotifCustomer.deviceId);
                            for (let deviceId of serNotifCustomer.deviceId) {
                              console.log(deviceId);
                              sendNotif.send([deviceId], notifCustomer);
                            }
                            ServiceNotification.findOne(
                              { userId: req.body.vendorId },
                              (err, serNotifVendor) => {
                                if (!err && serNotifVendor) {
                                  console.log(4);
                                  console.log(req.body.vendorId);
                                  console.log(serNotifVendor);
                                  for (let deviceId of serNotifVendor.deviceId) {
                                    console.log(deviceId);
                                    sendNotif.send([deviceId], notifVendor);
                                  }
                                  res
                                    .status(200)
                                    .send(
                                      "all of the stuff is done\n" + { item }
                                    );
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  });
                }
              });
            })

            .catch((err) => {
              console.log(err);
              res.status(400).send("Unable to save to database");
            });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send("unable to update the database");
        });
    }
  });
});

//remove booking
bookingRoutes.route("/:id").delete((req, res) => {
  var id = req.params.id;
  var extractedId = req.id;

  Booking.findById(id, (err, booking) => {
    if (err) res.status(400).json("An error occurs!");
    else {
      if (
        extractedId != req.body.vendorId &&
        extractedId != req.body.customerId
      ) {
        res.status(401).send("Unauthorized user");
        return;
      }
      booking.remove().then((v) => {
        res.status(200).json("Delete succesfully!");
      });
    }
  });
});

module.exports = bookingRoutes;
