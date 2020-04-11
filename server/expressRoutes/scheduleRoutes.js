var express = require("express");
var scheduleRoutes = express.Router();
var Schedule = require("../models/unavailableDate");
var Booking = require("../models/booking");
var Notification = require("../models/notification");
var Pet = require("../models/pet");
var Customer = require("../models/customer");
var expoPush = require("../services/expoPush");
var ServiceNotification = require("../models/serviceNotification");
//add unavailableDates
scheduleRoutes.route("/add").post(function (req, res) {
  req.body.date = new Date(req.body.date);
  if (req.body.vendorId != req.id) {
    res.status(401).send("Unauthorized user");
    return;
  }
  var schedule = new Schedule(req.body);

  Schedule.exists(
    { vendorId: schedule.vendorId, date: schedule.date },
    function (err, result) {
      if (err) {
        res.status(400).send(err);
      } else {
        if (result == false) {
          //same vendor same date
          //res.json("Date is already blocked!");
          //cancel booking when date is blocked
          schedule
            .save()
            .then((item) => {
              Booking.find(
                { vendorId: schedule.vendorId },
                async (err, bookings) => {
                  if (err) {
                    res.status(400).send("error");
                  } else {
                    let error = false;
                    let listPushes = [];
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
                        await notification
                          .save()
                          .then((notif) => {
                            listPushes.push(
                              expoPush.sendNotif(notif, (status, str) => {
                                if (status != 200) {
                                  console.log(err);
                                  error = true;
                                }
                              })
                            );
                          })
                          .catch((err) => {
                            console.log(err);
                            error = true;
                          });
                      }
                    }
                    await Promise.all(listPushes);
                    if (error) res.status(400).send("Some error occurs");
                    else
                      res
                        .status(200)
                        .send(
                          "Set the schedule and send notification successfully"
                        );
                  }
                }
              );
            })
            .catch((err) => {
              console.log(err);
              res.status(400).send("Unable to save to database");
            });
        } else res.status(200).json("Already marked as unavailable");
      }
    }
  );
});

//get unavailable dates by vendorID
scheduleRoutes.route("/vendor/:id").get(function (req, res) {
  var id = req.params.id;

  Schedule.find({ vendorId: id }, function (err, schedule) {
    if (err) res.status(400).json(err);
    else res.status(200).json(schedule);
  });
});

//get unavailable dates by id
scheduleRoutes.route("/:id").get(function (req, res) {
  var id = req.params.id;

  Schedule.findById({ _id: id }, function (err, unavailableDate) {
    if (err) res.status(400).json(err);
    else res.status(200).json(unavailableDate);
  });
});

//delete by date
scheduleRoutes.route("/date").delete(function (req, res) {
  var date = new Date(req.body.date);
  var vendorId = req.body.vendorId;
  if (vendorId != req.id) {
    res.status(401).send("Unauthorized user");
    return;
  }
  Schedule.findOne({ date: date, vendorId: vendorId }, (err, unavailableDate) => {
    if (err) res.status(400).json("Errors!!!");
    else if (!unavailableDate) res.status(400).send("There is no such unavalaible date");
    else {
      unavailableDate.remove().then(() => {
        res.status(200).json("Delete successfully");
      });
    }
  });
});

//delete by id
scheduleRoutes.route("/:id").delete(function (req, res) {
  var id = req.params.id;
  var vendorId = req.body.vendorId;
  if (vendorId != req.id) {
    res.status(401).send("Unauthorized user");
    return;
  }
  Schedule.findById(id, function (err, unavailableDate) {
    if (err) res.status(400).json("Errors!!!");
    else if (!unavailableDate) res.status(400).send("There is no such unavailable date");
    else {
      unavailableDate.remove().then(() => {
        res.status(200).json("Delete successfully");
      });
    }
  });
});

module.exports = scheduleRoutes;
