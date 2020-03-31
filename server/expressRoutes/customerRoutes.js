var express = require('express');
var customerRoutes = express.Router();
var Customer = require('../models/customer');
var authSevice = require('../services/auth');

// get customer by id
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

//update customer profile except password
customerRoutes.route('/:id').put((req, res) => {
    var id = req.params.id;
    var extractedId = req.id;

    if(extractedId != id){
        res.status(401).send('Unauthorized user');
        return;
    }

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
                res.status(200).json("ok");
            })
            .catch(err => {
                console.log(err);
                res.status(400).send("unable to update the database");
            });
        }
    })
})


//update customer password
customerRoutes.route('/password/:id').put((req, res) => {
    var id = req.params.id;
    var extractedId = req.id;

    if(extractedId != id){
        res.status(401).send('Unauthorized user');
        return;
    }
    
    Customer.findById(id, (err, customer) => {
        
        if (!customer || err) return next(new Error('Could not load Document'));
        else {
            authSevice.hashPassword(req.body.password, (hashedPassword) => {
                customer["password"] = hashedPassword;
                customer.save()
                .then(customer => {
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

module.exports = customerRoutes;