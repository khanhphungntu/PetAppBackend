var express = require('express');
var scheduleRoutes = express.Router();
var Schedule = require('../models/unavailableDate');

//set vendor
scheduleRoutes.route('/add').post(function(req,res){
    var schedule = new Schedule(req.body);

    Schedule.exists({vendorId : schedule.vendorId}, function(err,result){
            if (err){
                res.send(err);
            }
            else {
                if (result == true){
                    Schedule.exists({date: schedule.date},function(err,result){
                        if (err){
                            res.send(err);
                        }
                        else{
                            if (result == true)
                            res.json("Date is already booked!");
                            else{
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
            }   
        })
});

//get booking by vendorID
scheduleRoutes.get('/').get(function(req,res){
    var id = req.body.id;
    var extractedId = req.id;

    if(extractedId != id){
        res.status(401).send('Unauthorized user');
        return;
    }

    Schedule.find({vendorId: vendorId},function(err,schedule){
        if (err) res.json(err);
        else res.json(schedule);
    })
})

//delete by id
scheduleRoutes.route('/:id').delete(function(req,res){
    var id = req.body.id;
    var extractedId = req.id;

    if(extractedId != id){
        res.status(401).send('Unauthorized user');
        return;
    }

    if(id.vendorId == extractedId.vendorId){
        Schedule.findByIdAndRemove(id, function(err,schedule){
            if (err) res.json(err);
            else res.json('Succesfully removed');
        })
    }
    else {
        res.json('Delete wrong vendor');    
        return;
    }
})


module.exports = scheduleRoutes;  