var express = require("express");
var serviceRoutes = express.Router();
var Service = require("../models/service");
var Vendor = require("../models/vendor");

// add new service
serviceRoutes.route("").post((req, res) => {
  var extractedId = req.id;
  var service = new Service(req.body);

  // console.log(service.vendorId);
  // console.log(extractedId);
  if (service.vendorId != extractedId) {
    res.status(401).send("Unauthorized user");
    return;
  }

  service
    .save()
    .then((item) => {
      res.status(200).json({ item });
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});

// delete service from database
serviceRoutes.route("/:id").delete((req, res) => {
  var extractedId = req.id;

  Service.findById({ _id: req.params.id }, function (err, service) {
    if (err) res.status(400).send("Could not load document");
    else {
      if (service.vendorId !== extractedId) {
        res.status(401).send("Unauthorized user");
      } else {
        Service.findOneAndDelete({ _id: req.params.id })
          .then((item) => {
            res.status(200).send("Deleted Successfully");
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      }
    }
  });
});

//update service
serviceRoutes.route("/:id").put((req, res) => {
  var id = req.params.id;
  var extractedId = req.id;

  Service.findById(id, (err, service) => {
    if (!service || err) res.status(400).send("Could not load documents");
    else {
      if (extractedId != req.body.vendorId) {
        res.status(401).send("Unauthorized user");
        return;
      }

      for (item of Object.keys(req.body)) {
        service[item] = req.body[item];
      }

      service
        .save()
        .then((service) => {
          res.status(200).json("ok");
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send("unable to update to the database");
        });
    }
  });
});

//get service

serviceRoutes.route("/:id").get((req, res) => {
  var id = req.params.id;

  Service.findById(id, (err, service) => {
    if (!service || err) res.status(400).send("Could not load document");
    else {
      res.status(200).json(service);
    }
  });
});

// get all services by a vendor
serviceRoutes.route("/vendor/:vendorId").get((req, res) => {
  var id = req.params.vendorId;

  Service.find({ vendorId: id }, (err, services) => {
    if (!services || err) res.status(400).send("Could not load document");
    else {
      res.status(200).json(services);
    }
  });
});
module.exports = serviceRoutes;
