var express = require('express')
var vendorLocationRoutes = express.Router();
var vendorLocation = require('../models/vendorLocation');

//get all Vendor Locations
vendorLocationRoutes.route("").get( (req,res)=>{
    vendorLocation.find().sort({name:1}).then((data)=>{

        res.status(200).json(data);
    });
})

//get vendor Location by name
vendorLocationRoutes.route("/:name").get((req,res)=>{
    vendorLocation.find({name:req.params.name},(err,data)=>{
        res.status(200).json(data);
    })
})

vendorLocationRoutes.route("/:id").get((req,res)=>{
    vendorLocation.findById(req.params.id,(err,data)=>{
        res.status(200).json(data);
    })
})

module.exports = vendorLocationRoutes