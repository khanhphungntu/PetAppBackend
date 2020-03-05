var express = require('express');
var vendorRoutes = express.Router();
var Vendor = require('../models/vendor');
const app = express();

// add new vendor
vendorRoutes.route('/add').post(function (req, res) {

    var vendor = new Vendor(req.body);
    
    vendor.save()
    .then(item => {
        res.status(200).json({item});
    })
    .catch(err => {
        res.status(400).send("unable to save to database");
    });

});

// delete vendor from database
vendorRoutes.route('/:id').delete(function (req, res) {

    Vendor.findByIdAndRemove({_id: req.params.id}, function(err, vendor){

      if(err) res.json(err);
      else res.json('Successfully removed');

    });

});

//update vendor
vendorRoutes.route('/:id').put(function(req,res){
    Vendor.findByIdAndUpdate({_id: req.params.id},function(err, vendor){
        
        if(err) res.json(err);
        else res.json('Successfully updated');
    })

});


//read vendor
vendorRoutes.route('/:id').get(function(req,res){
    Vendor.findById({_id: req.params.id},function(err,vendor){

        if(err) res.json(err);
        else {
            res.json('Successfully read');
        }
     })

});


module.exports = vendorRoutes;  