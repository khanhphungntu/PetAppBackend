var express = require('express');
var vendorRoutes = express.Router();
var Vendor = require('../models/vendor');
var authSevice = require('../services/auth');

vendorRoutes.route('/').post((req, res) => {

    var vendor = new Vendor(req.body);

    Vendor.find({email: vendor.email}, (err, data) => {
        if (err) {
            console.log(err);
            res.status(400).send("An error occurs!");
        }
        else if(data.length > 0){
            res.status(400).send("The email has already been used!");
        }
        else{
            authSevice.hashPassword(vendor.password, (hashedPasword) => {
                vendor.password = hashedPasword;
                vendor.save()
                .then(item => {
                    res.status(200).json({item});
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send("Unable to save to database");
                })
            })
        }
    })
})

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

vendorRoutes.route('/:id').put((req, res) => {
    var id = req.params.id;
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
                res.json("ok");
            })
            .catch(err => {
                console.log(err);
                res.status(400).send("unable to update the database");
            });
        }
    })
})

vendorRoutes.route('/password/:id').put((req, res) => {
    var id = req.params.id;
    Vendor.findById(id, (err, vendor) => {
        
        if (!vendor || err) return next(new Error('Could not load Document'));
        else {
            authSevice.hashPassword(req.body.password, (hashedPassword) => {
                vendor["password"] = hashedPassword;
                vendor.save()
                .then(vendor => {
                    res.json("ok");
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