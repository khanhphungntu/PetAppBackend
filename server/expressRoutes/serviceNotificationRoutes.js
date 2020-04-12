var express = require('express');
var serviceNotificationRoutes = express.Router();
var ServiceNotification = require('../models/serviceNotification');

/**
 * Add a deviceId to the deviceId list of
 * a user (this list is used for push notification)
 */
serviceNotificationRoutes.route('/').post((req, res) => {

    var userId = req.id;
    ServiceNotification.findOne({userId: userId}, (err, user) => {
        if(err){
            console.log(err);
            res.status(400).send("Bad request!")
        }
        else{
            if(user){
                let devices = user.deviceId;
                if(devices.includes(req.body.deviceId)){
                    res.status(200).send('Device is registered!')
                    return;
                }
                devices.push(req.body.deviceId);

                user.update({deviceId: devices}, (err, user) => {
                    if(err){
                        console.log(err);
                        res.status(400).send("Unable to update database")
                    }
                    else{
                        res.status(200).send('Device is registered!')
                    }
                } )
            }
            else{
                let serviceNotification = new ServiceNotification({
                    userId: userId,
                    deviceId: [req.body.deviceId]
                })

                serviceNotification.save((err) => {
                    if(err){
                        console.log(err);
                        res.status(400).send("Unable to update database")
                    }
                    else{
                        res.status(200).send('Device is registered!')
                    }
                })
            }
        }
    })
})

module.exports = serviceNotificationRoutes;