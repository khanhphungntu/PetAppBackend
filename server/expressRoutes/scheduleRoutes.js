var express = require('express');
var scheduleRoutes = express.Router();
var Schedule = require('../models/unavailableDate');

//set vendor
scheduleRoutes.route('/add').post(function(req,res){
    var schedule = new Schedule(req.body);

    var id = req.body.id;
    
    Schedule.count({vendorId : schedule.vendorId}, function(err,count){
        if (count > 0){
            res.json(err);
            Schedule.count({date: schedule.date},function(err, count1){
                if (count1>0){
                    if (err) res.json(err);
                    res.status(400).send('Vendor is already booked!');
                    return;
                }
                schedule.save()
                .then(item => {
                    res.status(200).json({item});
                })
                .catch(err => {
                    res.status(400).send("unable to save to database");
                });
            })
        }
    })
});


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