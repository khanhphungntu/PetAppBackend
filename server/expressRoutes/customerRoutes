var express = require('express');
var customerRoutes = express.Router();
var Customer = require('../models/customer');

customerRoutes.route('/add').post(function (req, res) {

    var customer = new Customer(req.body);
    
    customer.save()
    .then(item => {
        res.status(200).json({item});
    })
    .catch(err => {
        res.status(400).send("unable to save to database");
    });

});



customerRoutes.route('/:id').put((req,res)=>{
    var customer = Customer.findOneAndUpdate({id: req.params.id},req.body)
    .then(item=>{
        res.status(200).json({item});
    })
    .catch(err =>{
        res.status(400).send("unable to update");
    })
})

customerRoutes.route("/:id").delete((req,res)=>{
    Customer.findByIdAndRemove({id: req.params.id}, function(err, customer){

        if(err) res.json(err);
        else res.json('Successfully removed');
  
      });
  
})
module.exports = customerRoutes;
