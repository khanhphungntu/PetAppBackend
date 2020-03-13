var express = require('express');
var bookingRoutes = express.Router();
var Booking = require('../models/booking');

bookingRoutes.route('/').post((req, res) => {

    var booking = new Booking(req.body);

    var extractedId = req.id;

    if(extractedId != booking.customerId){
        res.status(401).send('Unauthorized user');
        return;
    }

    booking.save()
    .then(item => {
        res.status(200).json({item});
    })
    .catch(err => {
        console.log(err);
        res.status(400).send("Unable to save to database");
    })
})

//query booking of one customer
bookingRoutes.route('/customer').get((req, res) => {
    var customerId = req.body.customerId;
    var extractedId = req.id;

    if(extractedId != customerId){
        res.status(401).send('Unauthorized user');
        return;
    }

    Booking.find({customerId: customerId},  (err, bookings) => {
        if(err){
            console.log(err);
            res.status(400).send("An error occurs!");
        }
        res.status(200).json(bookings);
    });
})

//query booking of one vendor
bookingRoutes.route('/vendor').get((req, res) => {
    var vendorId = req.body.vendorId;
    var extractedId = req.id;

    if(extractedId != vendorId){
        res.status(401).send('Unauthorized user');
        return;
    }
    
    Booking.find({vendorId: vendorId},  (err, bookings) => {
        if(err){
            console.log(err);
            res.status(400).send("An error occurs!");
        }
        res.status(200).json(bookings);
    });
})

//query booking of one pet
bookingRoutes.route('/pet').get((req, res) => {
    var petId = req.body.petId;
    Booking.find({petId: petId},  (err, bookings) => {
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

//update booking
bookingRoutes.route('/:id').put((req, res) => {
    var id = req.params.id;
    var extractedId = req.id;

    Booking.findById(id, (err, booking) => {
        
        if (!booking || err) return next(new Error('Could not load Document'));
        else {
            if(extractedId != req.body.vendorId && extractedId != req.body.customerId){
                res.status(401).send('Unauthorized user');
                return;
            }

            for ( item of Object.keys(req.body)){
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