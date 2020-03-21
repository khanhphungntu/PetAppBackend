var express = require('express');
var vendorRoutes = express.Router();
var Vendor = require('../models/vendor');
var authSevice = require('../services/auth');

// get vendor by id
vendorRoutes.route('/:id').get((req, res) => {
    var id = req.params.id;
    Vendor.findById(id,  (err, vendor) => {
        if(err){
            console.log(err);
            res.status(400).send("An error occurs!");
        }
        res.status(200).json(vendor);
    });
})

// update vendor by id
vendorRoutes.route('/:id').put((req, res) => {
    var id = req.params.id;
    var extractedId = req.id;

    if(extractedId != id){
        res.status(401).send('Unauthorized user');
        return;
    }

    Vendor.findById(id, (err, vendor) => {
        
        if (!vendor || err) return next(new Error('Could not load Document'));
        else {

            for ( item of Object.keys(req.body)){
                if(item == "password"){
                    continue;
                }
                vendor[item] = req.body[item];
            }

            vendor.save()
            .then(vendor => {
                res.json("ok");
            })
            .catch(err => {
                console.log(err);
                res.status(400).send("unable to update the database");
            });
        }
    })
})


//update vendor password
vendorRoutes.route('/password/:id').put((req, res) => {
    var id = req.params.id;
    var extractedId = req.id;

    if(extractedId != id){
        res.status(401).send('Unauthorized user');
        return;
    }

    Vendor.findById(id, (err, vendor) => {
        
        if (!vendor || err) return next(new Error('Could not load Document'));
        else {
            authSevice.hashPassword(req.body.password, (hashedPassword) => {
                vendor["password"] = hashedPassword;
                vendor.save()
                .then(vendor => {
                    res.json("ok");
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send("unable to update the database");
                });
            })
        }
    })
})

// add new service
serviceRoutes.route('/service').post((req, res) => {
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
serviceRoutes.route('/service/:id').delete((req, res) => {
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
serviceRoutes.route('/service/:id').put((req,res)=>{
    var id = req.params.id;
    var extractedId = req.id;

    Service.findById(id, (err, service)=>{
        if (!service || err) res.status(400).send("Could not load documents");
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
module.exports = vendorRoutes;