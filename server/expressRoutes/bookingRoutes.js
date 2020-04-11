var express = require("express");
var bookingRoutes = express.Router();
var Booking = require("../models/booking");
var Notification = require("../models/notification");
var Schedule = require("../models/unavailableDate");
var Pet = require("../models/pet");
var Customer = require("../models/customer");
var expoPush = require("../services/expoPush");
var ServiceNotification = require("../models/serviceNotification");
//add new booking
bookingRoutes.route("/").post((req, res) => {
  var booking = new Booking(req.body);
  var extractedId = req.id;
  if (extractedId != booking.customerId) {

    res.status(401).send("Unauthorized user");
    return;
  }

  Schedule.find({ vendorId: booking.vendorId })
    .then(( unavailableDate) => {
      if (unavailableDate.length > 0) {

        for (let date of unavailableDate) {
          if (
            date.date.getFullYear() == booking.time.getFullYear() &&
            date.date.getMonth() == booking.time.getMonth() &&
            date.date.getDate() == booking.time.getDate()
          ) {
            console.log(date.date);
            return true;
          }
        }
        return false;
      } else return false;
    })
    .then((clash) => {
      console.log(clash);
      if (clash) {
        res.status(400).send("The vendor is not available on the date");
        return;
      } else {
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
              .then(async (notif) => {
                await expoPush.sendNotif(notif, (status, str) => {
                  res.status(status).send(str);
                })

              })
              .catch((err) => {
                console.log("1 "+err);
                if (err)
                res.status(400).send("Unable to save to database");
              });
          })
          .catch((err) => {
            console.log("2 "+err);
            if (err)
            res.status(400).send("Unable to save to database");
          });
      }
    })
    .catch((err)=>{
      console.log("3 "+err)
      if (err)
      res.status(400).send("Some error occurs "+err);
      
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
    .sort({ createdAt: -1 })
    .exec((err, bookings) => {
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
  // console.log("Request ")
  // console.log(req)

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
    // console.log("response ")
    // console.log(res)
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
bookingRoutes.route("/pet/:id/:fromTime").get((req, res) => {
  var date = req.params.fromTime || Date.now();

  Booking.find({ petId: req.params.id, time: { $lt: date } })
    .sort({ time: -1 })
    .limit(10)
    .exec((err, bookings) => {
      if (err) {
        console.log(err);
        res.status(400).send("Could not load document!");
        return;
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
      return;
    }
    if (booking.customerId != req.id && booking.vendorId != req.id)
      res
        .status(401)
        .send(
          "Unauthorized user, you have to be customer or vendor of this booking to view it"
        );
    res.status(200).json(booking);
  });
});

//update booking (cancel/complete booking)
//must enter status to set status
bookingRoutes.route("/:id").put((req, res) => {
  var id = req.params.id;
  var extractedId = req.id;

  Booking.findById(id, (err, booking) => {
    if (err) res.status(400).json(err);
    else if (!booking) res.status(400).json("Cannot find the booking");
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
            .then(async (notif) => {
              await expoPush.sendNotif(notif, (status, str) => {
                res.status(status).send(str);
              });
            })

            .catch((err) => {
              console.log(err);
              res
                .status(400)
                .send(
                  "Some errors while trying to save the notification to database"
                );
            });
        })
        .catch((err) => {
          console.log(err);
          res
            .status(400)
            .send("Some errors while trying to update the database");
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
    else if (!booking) res.status(200).json("Can not find the booking");
    else {
      if (
        extractedId != booking.vendorId &&
        extractedId != booking.customerId
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
