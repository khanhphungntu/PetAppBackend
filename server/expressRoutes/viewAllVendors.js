var express = require('express')
var viewAllVendorRoutes = express.Router();
const csv = require("csvtojson");
const path = require("path")

 viewAllVendorRoutes.route("").get( async(req,res)=>{
    const csvFilePath =path.join(process.cwd().replace("\\","/"),"/server/expressRoutes/list-of-licensed-vet-centres.csv")
    csv().fromFile(csvFilePath).then(
        (jsonObj) => {res.json(jsonObj)}
    )
})

module.exports = viewAllVendorRoutes