var express = require('express');
var vendorRoutes = express.Router();
var Vendor = require('../models/vendor');
var authSevice = require('../services/auth');

// get vendor by id
vendorRoutes.route('/:id').get((req, res) => {
    var id = req.params.id;
    Vendor.findById(id,  (err, vendor) => {
        if(err){
            console.log(err);
            res.status(400).send("An error occurs!");
        }
        res.status(200).json(vendor);
    });
})

// update vendor by id
vendorRoutes.route('/:id').put((req, res) => {
    var id = req.params.id;
    var extractedId = req.id;

    if(extractedId != id){
        res.status(401).send('Unauthorized user');
        return;
    }

    Vendor.findById(id, (err, vendor) => {
        
        if (!vendor || err) return next(new Error('Could not load Document'));
        else {

            for ( item of Object.keys(req.body)){
                if(item == "password"){
                    continue;
                }
                vendor[item] = req.body[item];
            }

            vendor.save()
            .then(vendor => {
                res.status(200).json("ok");
            })
            .catch(err => {
                console.log(err);
                res.status(400).send("unable to update the database");
            });
        }
    })
})


//update vendor password
vendorRoutes.route('/password/:id').put((req, res) => {
    var id = req.params.id;
    var extractedId = req.id;

    if(extractedId != id){
        res.status(401).send('Unauthorized user');
        return;
    }

    Vendor.findById(id, (err, vendor) => {
        
        if (!vendor || err) return next(new Error('Could not load Document'));
        else {
            authSevice.hashPassword(req.body.password, (hashedPassword) => {
                vendor["password"] = hashedPassword;
                vendor.save()
                .then(vendor => {
                    res.status(200).json("ok");
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send("unable to update the database");
                });
            })
        }
    })
})

module.exports = vendorRoutes;
