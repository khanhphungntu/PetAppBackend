var express = require('express');
var scheduleRoutes = express.Router();
var Schedule = require('../models/unavailableDate');
var Booking = require('../models/booking');
var Notification = require('../models/notification');


//set vendor
scheduleRoutes.route('/add').post(function(req,res){
    var schedule = new Schedule(req.body);
    var existvendor = false;

    Schedule.exists({vendorId : schedule.vendorId}, function(err,result){
        if (err){
            res.send(err);
        }
        else {
            if (result == true){
                existvendor = true;
                Schedule.exists({date: schedule.date},function(err,result){
                    if (err){
                        res.send(err);
                    }
                    else{
                        if (result == true){
                            //same vendor same date
                            res.json("Date is already booked!");

                            //cancel booking
                            Booking.findOne({vendorId : schedule.vendorId}, function(err,booking){
                                
                                booking.status = "cancelled";
                                booking.save();
                                var notification = new Notification();
                                notification.vendorId = booking.vendorId;
                                notification.customerId = booking.customerId;
                                notification.bookingStatus = "cancelled";
                                notification.bookingId = booking.id;
                                notification.save()
                                .catch(err => {
                                console.log(err);
                                res.status(400).send("Unable to save to database");
                                })
                            })
                            return;
                            }
                        else{
                            //same vendor different date
                            schedule.save()
                            .then(item => {
                            res.status(200).json({item});
                            })
                            .catch(err => {
                            res.status(400).send("unable to save to database");
                            });
                        }
                    }
                })
            }
            //different vendor
            if (existvendor == false){
            schedule.save()
            .then(item => {
            res.status(200).json({item});
            })
            .catch(err => {
            res.status(400).send("unable to save to database");
            });
            }
            else return;
        }   
    })
});
    
//get booking by id
scheduleRoutes.get('/:id').get(function(req,res){
    var id = req.params.id;

    Schedule.findById({_id: id},function(err,unavailableDate){
        if (err) res.json(err);
        else res.json(unavailableDate);
    })
})

//get booking by vendorID
scheduleRoutes.get('/vendor/:id').get(function(req,res){
    var id = req.params.id;
    var extractedId = req.id;

    if(extractedId != id){
        res.status(401).send('Unauthorized user');
        return;
    }

    Schedule.findById({vendorId: id},function(err,schedule){
        if (err) res.json(err);
        else res.json(schedule);
    })
})

//delete by id
scheduleRoutes.route('/:id').delete(function(req,res){
    var id = req.params.id;

        Schedule.findByIdAndDelete(id, function(err,schedule){
            if (err) res.json(err);
            else res.json('Succesfully removed');
        })
    

})


module.exports = scheduleRoutes;  