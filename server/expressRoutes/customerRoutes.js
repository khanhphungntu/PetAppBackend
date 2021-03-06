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
        
        if (!customer || err) 
        {
            res.status(400).json('Could not load Document or error '+err);
            return;
        }
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
        
        if (!customer || err)
        {
            res.status(400).json("Customer not found or error "+err)
            return
        } 
        else {
            var oldPwd = req.body.oldPwd;
            authSevice.comparePassword(oldPwd, customer.password, (isMatch) => {
                if(isMatch){
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
                else{
                    res.status(400).send("Incorrect password!")
                }
            })
        }
    })
})

module.exports = customerRoutes;