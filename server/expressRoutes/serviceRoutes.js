var express = require('express');
var serviceRoutes = express.Router();
var Service = require('../models/service');

// add new service
serviceRoutes.route('/add').post((req, res) => {

    var service = new Service(req.body);
    
    service.save()
    .then(item => {
        res.status(200).json({item});
    })
    .catch(err => {
        res.status(400).send("unable to save to database");
    });

});

// delete service from database
serviceRoutes.route('/:id').delete((req, res) => {

    Service.findByIdAndRemove({_id: req.params.id}, function(err, service){

      if(err) res.json(err);
      else res.json('Successfully removed');

    });

});

module.exports = serviceRoutes;