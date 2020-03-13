var express = require('express');
var accountRoutes = express.Router();
var Customer = require('../models/customer');
var Vendor = require('../models/vendor');
var authSevice = require('../services/auth');

//create customer account
accountRoutes.route('/customer').post((req, res) => {

    var customer = new Customer(req.body);

    Customer.find({email: customer.email}, (err, data) => {
        if (err) {
            console.log(err);
            res.status(400).send("An error occurs!");
        }
        else if(data.length > 0){
            res.status(400).send("The email has already been used!");
        }
        else{
            authSevice.hashPassword(customer.password, (hashedPasword) => {
                customer.password = hashedPasword;
                customer.save()
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


//create vendor account
accountRoutes.route('/vendor').post((req, res) => {

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

module.exports = accountRoutes;