const express = require('express');
const jwt = require('jsonwebtoken');
const secret = require('./secret.json');
const authService = require('../services/auth');
const crypto = require("crypto");
const emailjs = require('emailjs-com');
const fs = require('fs');
var authSevice = require('../services/auth');
var Customer = require('../models/customer');
var Vendor = require('../models/vendor');
var authRoutes = express.Router();
const nodemailer = require('nodemailer');



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
                        token: token,
                        id: customer._id
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
                    
                    const token = jwt.sign(payload, secret.key,{
                        expiresIn:'24h'
                    });

                    res.status(200).json({
                        token: token,
                        id: vendor._id
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
            console.log(newPwd);
            authSevice.hashPassword(newPwd, (hashedPasword) => {
                vendor.password = hashedPasword;
                vendor.save()
                .then(item => {
                    res.status(200).send("Password is reset successfully");
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send("Unable to save to database");
                })
            })
            var transporter = nodemailer.createTransport({

                service: 'gmail',
                auth: {
                       user: 'cz2006ntu@gmail.com',
                       pass: 'helloworld123'
                   }
               });
            const mailOptions = {
                from: 'cz2006ntu@gmail.com', // sender address
                to: vendor.email, // list of receivers
                subject: 'Password recovery for Pet App', // Subject line
                html: '<p>Your new password is: ' + newPwd+'</p>' // plain text body
            };
            transporter.sendMail(mailOptions, (err, info) => {
                if(err)
                  console.log(err)
             });

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
                    res.status(200).send("Password is reset successfully");
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send("Unable to save to database");
                })
            })

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                       user: 'cz2006ntu@gmail.com',
                       pass: 'helloworld123'
                   }
               });

            const mailOptions = {
                from: 'cz2006ntu@gmail.com', // sender address
                to: customer.email, // list of receivers
                subject: 'Password recovery for Pet App', // Subject line
                html: '<p>Your new password is: ' + newPwd+'</p>' // plain text body
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if(err)
                  console.log(err)
             });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(400).send("Authentication error!");
    })
})
module.exports = authRoutes