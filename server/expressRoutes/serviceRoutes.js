var express = require('express');
var serviceRoutes = express.Router();
var Service = require('../models/service');


// add new service
serviceRoutes.route('/add').post((req, res) => {
    var extractedId = req.id;
    var service = new Service(req.body);
    
    if (service.vendorId!==extractedId){
        res.status(401).send("Unauthorized user");
        return;}
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
    var extractedId = req.id;
    
    Service.findById({_id: req.params.id},function(err, service){
      if(err) res.status(400).send("Could not load document");
      else {
          if (service.vendorId!==extractedId){
              res.status(401).send("Unauthorized user");
          }
          else{
              Service.findByIdAndRemove({_id:req.params.id}).then(
                  item=>{
                      res.status(200).send("Deleted Successfully");
                  }
              ).catch(err=>{
                  res.status(400).send(err);
              })
          }
      }

    });

});

//update service
serviceRoutes.route('/:id').put((req,res)=>{
    var id = req.params.id;
    var extractedId = req.id;

    Service.findById(id, (err, service)=>{
        if (!service || err) return res.status(400).send("Could not load documents");
        else {
            if (extractedId!=req.body.vendorId){
                res.status(401).send('Unauthorized user');
                return;
            }

            for (item of Object.keys(req.body)){
                service[item] = req.body[item];
            }

            service.save()
            .then(service =>{
                res.json("ok");
            })
            .catch(err =>{
                console.log(err);
                res.status(400).send("unable to update to the database")
            })
        }
    })
})

//get service

serviceRoutes.route('/:id').get((req,res)=>{
    var id = req.params.id;

    Service.findById(id, (err, service)=>{
        if (!service || err) return next(new Error('Could not load document'));
        else {
            res.json(service);
        }
    })
})

module.exports = serviceRoutes;