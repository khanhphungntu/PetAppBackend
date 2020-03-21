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

//get booking by id
scheduleRoutes.get('/:id').get(function(req,res){
    var id = req.params.id;

    Schedule.findById({_id: id},function(err,unavailableDate){
        if (err) res.json(err);
        else res.json(unavailableDate);
    })
})

//get booking by vendorID
scheduleRoutes.get('/').get(function(req,res){
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