var express = require("express");
var scheduleRoutes = express.Router();
var Schedule = require("../models/unavailableDate");
var Booking = require("../models/booking");
var Notification = require("../models/notification");
var Pet = require("../models/pet");
var Customer = require("../models/customer");
var sendNotif = require("../services/notification");
var ServiceNotification = require("../models/serviceNotification");
//add unavailableDates
scheduleRoutes.route("/add").post(function(req, res) {
  req.body.date = new Date(req.body.date);
  var schedule = new Schedule(req.body);

  Schedule.exists(
    { vendorId: schedule.vendorId, date: schedule.date },
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        if (result == false) {
          //same vendor same date
          //res.json("Date is already blocked!");
          //cancel booking when date is blocked
          Booking.find({ vendorId: schedule.vendorId }, function(
            err,
            bookings
          ) {
            if (err) {
              res.status(400).send("error");
            } else {
              for (id in bookings) {
                let booking = bookings[id];
                let time = booking.time;

                if (
                  booking.status == "booked" &&
                  schedule.date.getFullYear() == time.getFullYear() &&
                  schedule.date.getMonth() == time.getMonth() &&
                  schedule.date.getDate() == time.getDate()
                ) {
                  booking.status = "cancelled";
                  booking.save().then(console.log("Booking saved :)"));
                  let notification = new Notification();
                  notification.vendorId = booking.vendorId;
                  notification.customerId = booking.customerId;
                  notification.bookingStatus = "cancelled";
                  notification.bookingId = booking.id;
                  notification.petId = booking.petId;
                  notification.time = booking.time;
                  notification
                    .save()
                    .then(notif => {
                      console.log(1);
                      Pet.findById(notif.petId, (err, pet) => {
                        if (!err) {
                          Customer.findById(
                            notif.customerId,
                            (err, customer) => {
                              if (!err) {
                                console.log(2);
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
                                  "is canceled" ;
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
                                  " is canceled" ;
                                ServiceNotification.findOne(
                                  { userId: customer._id },
                                  (err, serNotifCustomer) => {
                                    if (!err) {
                                      console.log(3);
                                      console.log(serNotifCustomer.deviceId);
                                      for (let deviceId of serNotifCustomer.deviceId) {
                                        console.log(deviceId);
                                        sendNotif.send(
                                          [deviceId],
                                          notifCustomer
                                        );
                                      }
                                      ServiceNotification.findOne(
                                        { userId: notif.vendorId },
                                        (err, serNotifVendor) => {
                                          if (!err) {
                                            console.log(4);
                                            console.log(notif.vendorId);
                                            console.log(serNotifVendor);
                                            for (let deviceId of serNotifVendor.deviceId) {
                                              console.log(deviceId);
                                              sendNotif.send(
                                                [deviceId],
                                                notifVendor
                                              );
                                            }

                                          }
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      });
                    })
                    .catch(err => {
                      console.log(err);
                      res.status(400).send("Unable to save to database");
                    });
                }
              }
            }
            schedule
              .save()
              .then(item => {
                res.status(200).json({ item });
              })
              .catch(err => {
                console.log(err);
                res.status(400).send("Unable to save to database");
              });
          });
        } else res.status(200).json("Already marked as unavailable");
      }
    }
  );
});

//get unavailable dates by vendorID
scheduleRoutes.route("/vendor/:id").get(function(req, res) {
  var id = req.params.id;
  //   var extractedId = req.id;

  // if (extractedId != id) {
  //     res.status(401).send('Unauthorized user');
  //     return;
  // }

  Schedule.find({ vendorId: id }, function(err, schedule) {
    if (err) res.json(err);
    else res.status(200).json(schedule);
  });
});

//get unavailable dates by id
scheduleRoutes.route("/:id").get(function(req, res) {
  var id = req.params.id;

  Schedule.findById({ _id: id }, function(err, unavailableDate) {
    if (err) res.json(err);
    else res.status(200).json(unavailableDate);
  });
});

//delete by date
scheduleRoutes.route("/date").delete(function(req, res) {
  var date = new Date(req.body.date);
  var vendorId = req.body.vendorId;
  Schedule.findOneAndDelete({ date: date, vendorId: vendorId }, () => {
    res.status(200).json("");
  });
});
//delete by id
scheduleRoutes.route("/:id").delete(function(req, res) {
  var id = req.params.id;

  Schedule.findByIdAndDelete(id, function() {
    res.status(200).json("");
  });
});

module.exports = scheduleRoutes;
