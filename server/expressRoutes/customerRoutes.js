var express = require('express');
var customerRoutes = express.Router();
var Customer = require('../models/customer');
var authSevice = require('../services/auth');

customerRoutes.route('/').post((req, res) => {

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

customerRoutes.route('/:id').get((req, res) => {
    var id = req.params.id;
    Customer.findById(id,  (err, customer) => {
        if(err){
            console.log(err);
            res.status(400).send("An error occurs!");
        }
        res.status(200).json(customer);
    });
})

customerRoutes.route('/:id').put((req, res) => {
    var id = req.params.id;
    Customer.findById(id, (err, customer) => {
        
        if (!customer || err) return next(new Error('Could not load Document'));
        else {

            for ( item of Object.keys(req.body)){
                if(item == "password"){
                    continue;
                }
                customer[item] = req.body[item];
            }

            customer.save()
            .then(customer => {
                res.json("ok");
            })
            .catch(err => {
                console.log(err);
                res.status(400).send("unable to update the database");
            });
        }
    })
})

customerRoutes.route('/password/:id').put((req, res) => {
    var id = req.params.id;
    Customer.findById(id, (err, customer) => {
        
        if (!customer || err) return next(new Error('Could not load Document'));
        else {
            authSevice.hashPassword(req.body.password, (hashedPassword) => {
                customer["password"] = hashedPassword;
                customer.save()
                .then(customer => {
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

module.exports = customerRoutes;