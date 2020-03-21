var express = require('express')
var vendorLocationRoutes = express.Router();
var vendorLocation = require('../models/vendorLocation');

//get all Vendor Locations
vendorLocationRoutes.route("").get( (req,res)=>{
    vendorLocation.find((err,data)=>{
        res.status(200).json(data);
    });
})

//get vendor Location by name
vendorLocationRoutes.route("/:name").get((req,res)=>{
    vendorLocation.find({name:req.params.name},(err,data)=>{
        res.status(200).json(data);
    })
})
module.exports = vendorLocationRoutes