var express = require("express");
var vendorLocationRoutes = express.Router();
var VendorLocation = require("../models/vendorLocation");

//get all Vendor Locations
vendorLocationRoutes.route("").get((req, res) => {
  VendorLocation.find()
    .sort({ name: 1 })
    .then((result) => {
        let data = [] 
        for (let i of result){
            if (i.vendorId)
                data.push(i)
        }

        for (let i of result){
            if (!i.vendorId)
                data.push(i)
        }

        res.status(200).json(data)
    })


});

//get vendor Location by name
vendorLocationRoutes.route("/:name").get((req, res) => {
  VendorLocation.find({ name: req.params.name }, (err, data) => {
    res.status(200).json(data);
  });
});

//get vendor Location by Id
vendorLocationRoutes.route("/vendor/:id").get((req, res) => {
  VendorLocation.findOne({ vendorId: req.params.id }, (err, data) => {
    if (!err) res.status(200).json(data);
    else res.status(400).json("Error when finding vendor Location by Id");
  });
});

// vendorLocationRoutes.route("/deleteNa").put((req,res)=>{
//     VendorLocation.find({},(err,locations)=>{
//         console.log("Yesss")
//         locations.forEach((location)=>
//         {
//              if (location['tel_office_2']==='na')
//         {
//             location['tel_office_2'] = null;
//             location.save().then(
//                 location => {res.status(200).json(location)}
//             ).catch(err=>{console.log(err)})
//             console.log("Yesssss")
//         }
//         console.log("location: "+location['tel_office_2'])

//         }
//         )
// }
// )})

module.exports = vendorLocationRoutes;
