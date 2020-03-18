var express = require('express');
var notificationRoutes = express.Router();
var Notification = require('../models/notification');
const app = express();

// add new notification
notificationRoutes.route('/add').post(function (req, res) {

    var notification = new Notification(req.body);
    
    notification.save()
    .then(item => {
        res.status(200).json({item});
    })
    .catch(err => {
        res.status(400).send("unable to save to database");
    });

});


// delete notification from database
notificationRoutes.route('/:id').delete(function (req, res) {

    Notification.findByIdAndRemove({_id: req.params.id}, function(err, notification){

      if(err) res.json(err);
      else res.json('Successfully removed');

    });

});

//update notification
notificationRoutes.route('/:id').put(function(req,res){
    Notification.findByIdAndUpdate({_id: req.params.id},function(err, notification){
        
        if(err) res.json(err);
        else res.json('Successfully updated');
    })

});


//read notification by id
notificationRoutes.route('/:id').get(function(req,res){
    Notification.findById({_id: req.params.id},function(err,notification){

        if(err) res.json(err);
        else res.json(notification);
        
     })

});

//read notification of one customer
notificationRoutes.route('/customer').get(function(req,res){
    var customerId = req.body.id;
    var extractedId = req.id;

    if(extractedId != customerId){
        res.status(401).send('Unauthorized user');
        return;
    }

    Notification.find(customerId, function(err, notification){
        if (err) {
            console.log(err);
            res.send.json('An error occurs!');
        }
        res.json(notification);
    })
})

//read notification of one vendor
notificationRoutes.route('/vendor').get(function(req,res){
    var vendorId = req.body.id;
    var extractedId = req.id;

    if(extractedId != vendorId){
        res.status(401).send('Unauthorized user');
        return;
    }

    Notification.find(vendorId, function(err, notification){
        if (err) {
            console.log(err);
            res.send.json('An error occurs!');
        }
        res.json(notification);
    })
})
//read notification of one pet
notificationRoutes.route('/pet').get(function(req,res){
    var petId = req.body.id;
    var extractedId = req.id;

    if(extractedId != petId){
        res.status(401).send('Unauthorized user');
        return;
    }

    Notification.find(petId, function(err, notification){
        if (err) {
            console.log(err);
            res.send.json('An error occurs!');
        }
        res.json(notification);
    })
})

module.exports = notificationRoutes;  