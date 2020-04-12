var express = require("express");
var accountRoutes = express.Router();
var Customer = require("../models/customer");
var Vendor = require("../models/vendor");
var authSevice = require("../services/auth");
var VendorLocation = require("../models/vendorLocation");
//create customer account
accountRoutes.route("/customer").post((req, res) => {
  var customer = new Customer(req.body);

  Customer.find({ email: customer.email }, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).send("An error occurs!");
    } else if (data.length > 0) {
      res.status(400).send("The email has already been used!");
    } else {
      authSevice.hashPassword(customer.password, (hashedPasword) => {
        customer.password = hashedPasword;
        customer
          .save()
          .then((item) => {
            res.status(200).send("Account is created successfully!");
          })
          .catch((err) => {
            console.log(err);
            res.status(400).send("Unable to save to database");
          });
      });
    }
  });
});

//create vendor account
accountRoutes.route("/vendor").post((req, res) => {
  var vendor = new Vendor(req.body);

  Vendor.find({ email: vendor.email }, (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).send("An error occurs!");
    } else if (data.length > 0) {
      res.status(400).send("The email has already been used!");
    } else {
      VendorLocation.findById(req.body.address, (err, vendorLocation) => {
        if (err) {
          console.log(err);
          res
            .status(400)
            .send("An error occurs when finding the vendorlocation");
        } else if (!vendorLocation) {
          res.status(400).send("Cannot find the vendor location");
        } else {
          authSevice.hashPassword(vendor.password, (hashedPasword) => {
            vendor.password = hashedPasword;
            vendor
              .save()
              .then((item) => {
                vendorLocation["vendorId"] = item._id;
                //console.log(vendorLocation);
                vendorLocation
                  .save()
                  .then((location) => {
                    res.status(200).json(item);
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(400).send("Unable to save vendor Location");
                  });
              })
              .catch((err) => {
                console.log(err);
                res.status(400).send("Unable to save the vendor to database");
              });
          });
        }
      }).catch((err) => {
        console.log(err);
        res.status(400).send("error when finding the vendor");
      });
    }
  });
});

module.exports = accountRoutes;
