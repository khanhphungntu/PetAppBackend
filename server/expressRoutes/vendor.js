var express = require('express');
var vendorRoutes = express.Router();
var Vendor = require('../models/vendor');

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



vendorRoutes.route('/:id').put((req,res)=>{
    var vendor = Vendor.findOneAndUpdate({id: req.params.id},req.body)
    .then(item=>{
        res.status(200).json({item});
    })
    .catch(err =>{
        res.status(400).send("unable to update");
    })
})

vendorRoutes.route("/:id").delete((req,res)=>{
    Vendor.findByIdAndRemove({id: req.params.id}, function(err, vendor){

        if(err) res.json(err);
        else res.json('Successfully removed');
  
      });
  
})
module.exports = vendorRoutes;
