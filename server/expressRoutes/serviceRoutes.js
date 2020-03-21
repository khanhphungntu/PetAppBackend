var express = require('express');
var serviceRoutes = express.Router();
var Service = require('../models/service');

//get service

serviceRoutes.route('/:id').get((req,res)=>{
    var id = req.params.id;

    Service.findById(id, (err, service)=>{
        if (!service || err)  res.status(400).send('Could not load document');
        else {
            res.status(200).json(service);
        }
    })
})


// get all services by a vendor
serviceRoutes.route('/vendor/:vendorId').get((req,res)=>{

    Service.find({vendorId: req.params.vendorId}, (err, services)=>{
        if (!services || err) res.status(400).send('Could not load document');
        else {
            res.status(200).json(services);
        }
    })
})
module.exports = serviceRoutes;