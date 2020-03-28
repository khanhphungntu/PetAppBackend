var express = require('express');
var bookingRoutes = express.Router();
var Booking = require('../models/booking');
var Notification = require('../models/notification');
var Schedule = require('../models/unavailableDate');

//add new booking
bookingRoutes.route('/').post((req, res) => {

    var booking = new Booking(req.body);
    var extractedId = req.id;

    if(extractedId != booking.customerId){
        console.log(extractedId);
        console.log(booking.customerId)
        res.status(401).send('Unauthorized user');
        return;
    }

    booking.save()
    .then(item => {
        res.status(200).json({item});
        //create new notification when a booking is made
        var notification = new Notification();
        notification.vendorId = item.vendorId;
        notification.customerId = item.customerId;
        notification.bookingStatus = 'booked';
        notification.bookingId = item._id;
        notification.save()
        .catch(err => {
            console.log(err);
            res.status(400).send("Unable to save to database");
        })
    })
    .catch(err => {
        console.log(err);
        res.status(400).send("Unable to save to database");
    })

    
})

//query booking of one customer
bookingRoutes.route('/customer/:id').get((req, res) => {
    var customerId = req.body.customerId;
    var extractedId = req.id;

    if(extractedId != customerId){
        res.status(401).send('Unauthorized user');
        return;
    }

    Booking.find({customerId: req.params.id},  (err, bookings) => {
        if(err){
            console.log(err);
            res.status(400).send("An error occurs!");
        }
        res.status(200).json(bookings);
    });
})

//query booking of one vendor
bookingRoutes.route('/vendor/:id').get((req, res) => {
    var vendorId = req.body.vendorId;
    var extractedId = req.id;

    if(extractedId != vendorId){
        res.status(401).send('Unauthorized user');
        return;
    }
    
    Booking.find({vendorId: req.params.id},  (err, bookings) => {
        if(err){
            console.log(err);
            res.status(400).send("An error occurs!");
        }
        res.status(200).json(bookings);
    });
})

//query booking of one pet
bookingRoutes.route('/pet/:id').get((req, res) => {
    var petId = req.body.petId;
    Booking.find({petId: req.params.id},  (err, bookings) => {
        if(err){
            console.log(err);
            res.status(400).send("An error occurs!");
        }
        res.status(200).json(bookings);
    });
})

//get boooking by id
bookingRoutes.route('/:id').get((req, res) => {
    var id = req.params.id;
    var extractedId = req.id;

    if(extractedId != req.body.vendorId && extractedId != req.body.customerId){
        res.status(401).send('Unauthorized user');
        return;
    }
    Booking.findById(id,  (err, booking) => {
        if(err){
            console.log(err);
            res.status(400).send("An error occurs!");
        }
        res.status(200).json(booking);
    });
})

//update booking (cancel/complete booking)
//must enter status to set status
bookingRoutes.route('/:id').put((req, res) => {
    var id = req.params.id;
    var extractedId = req.id;

    Booking.findById(id, (err, booking) => {
        
        if (err) return res.json(err);
        else {
            if(extractedId != req.body.id && extractedId != req.body.customerId){
                res.status(401).send('Unauthorized user');
                return;
            }
            
            for ( item of Object.keys(req.body)){
                if(item == "password"){
                    continue;
                }
                booking[item] = req.body[item];
            }

            booking.save()
            .then(booking => {
                res.json("ok");
                
            })
            .catch(err => {
                console.log(err);
                res.status(400).send("unable to update the database");
            });
            
        }
        var notification = new Notification();
        notification.vendorId = req.body.vendorId;
        notification.customerId = req.body.customerId;
        notification.bookingStatus = req.body.status;
        notification.bookingId = id;
        notification.save()
        .catch(err => {
        console.log(err);
        res.status(400).send("Unable to save to database");
    })
    })
})

//remove booking
bookingRoutes.route('/:id').delete((req, res) => {
    var id = req.params.id;
    var extractedId = req.id;

    Booking.findById(id, (err, booking) => {
        if(err) res.status(400).json("An error occurs!");
        else{
            if(extractedId != req.body.vendorId && extractedId != req.body.customerId){
                res.status(401).send('Unauthorized user');
                return;
            }
            booking.remove()
            .then((v) => {
                res.status(200).json("Delete succesfully!")
            })
        }
    })
})

module.exports = bookingRoutes;