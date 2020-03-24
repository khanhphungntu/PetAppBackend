const express = require('express');
const jwt = require('jsonwebtoken');
const secret = require('./secret.json');
const authService = require('../services/auth');
const crypto = require("crypto");
const emailjs = require('emailjs-com');
const fs = require('fs');
var Customer = require('../models/customer');
var Vendor = require('../models/vendor');
var authRoutes = express.Router();

//const env = fs.readFileSync('../../env.json');
authRoutes.route('/login/customer').post(async (req, res) => {
    const { email, password } = req.body;

    Customer.find({email: email}, (err, customers) =>{
        if(err) throw(err);
        if(customers.length == 0){
            res.status(400).send("User has not registered yet!")
        }
        else{
            var customer = new Customer(customers[0]);
            authService.comparePassword(password, customer.password, (isMatch) => {
                if(isMatch){
                    const payload = {
                        id: customer._id,
                    }
                    
                    const token = jwt.sign(payload, secret.key, {
                        expiresIn: '24h'
                    });

                    res.status(200).json({
                        token: token
                    })
                }
                else{
                    res.status(400).send("Incorrect email/password!")
                }
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(400).send("Authentication error!");
    })
})

authRoutes.route('/login/vendor').post(async (req, res) => {
    const { email, password } = req.body;

    Vendor.find({email: email}, (err, vendors) =>{
        if(err) throw(err);
        if(vendors.length == 0){
            res.status(400).send("User has not registered yet!")
        }
        else{
            var vendor = new Vendor(vendors[0]);
            authService.comparePassword(password, vendor.password, (isMatch) => {
                if(isMatch){
                    const payload = {
                        id: vendor._id,
                    }
                    
                    const token = jwt.sign(payload, secret.key);

                    res.status(200).json({
                        token: token
                    })
                }
                else{
                    res.status(400).send("Incorrect email/password!")
                }
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(400).send("Authentication error!");
    })
})

authRoutes.route('/password/vendor').post(async (req, res) => {
    const { email } = req.body;

    Vendor.find({email: email}, (err, vendors) =>{
        if(err) throw(err);
        if(vendors.length == 0){
            res.status(400).send("User has not registered yet!")
        }
        else{
            var vendor = new Vendor(vendors[0]);
            var newPwd = crypto.randomBytes(10).toString('hex');
            authSevice.hashPassword(newPwd, (hashedPasword) => {
                vendor.password = hashedPasword;
                vendor.save()
                .then(item => {
                    res.status(200).send("Account is created successfully!");
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send("Unable to save to database");
                })
            })
            var templateParams = {
                "password": newPwd
             }
             
             var serviceId = "default_service";
             var templateId = env.emailjs.template;
             emailjs.send(serviceId, templateId, templateParams, env.emailjs.userId);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(400).send("Authentication error!");
    })
})

authRoutes.route('/password/customer').post(async (req, res) => {
    const { email } = req.body;

    Customer.find({email: email}, (err, customers) =>{
        if(err) throw(err);
        if(customers.length == 0){
            res.status(400).send("User has not registered yet!")
        }
        else{
            var customer = new Customer(customers[0]);
            var newPwd = crypto.randomBytes(10).toString('hex');
            authSevice.hashPassword(newPwd, (hashedPasword) => {
                customer.password = hashedPasword;
                customer.save()
                .then(item => {
                    res.status(200).send("Account is created successfully!");
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send("Unable to save to database");
                })
            })
            var templateParams = {
                "password": newPwd
             }
             
             var serviceId = "default_service";
             var templateId = env.emailjs.template;
             emailjs.send(serviceId, templateId, templateParams, env.emailjs.userId);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(400).send("Authentication error!");
    })
})
module.exports = authRoutes