const express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cors = require('cors'),
mongoose = require('mongoose');

//api config
serviceRoutes = require('./server/expressRoutes/serviceRoutes');
customerRoutes = require('./server/expressRoutes/customerRoutes');
vendorRoutes = require('./server/expressRoutes/vendorRoutes')
// connect app to mongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/petApp').then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

// CORS handle
const app = express();
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cors());

//Mapping Express Route with Server Route
app.use('/service', serviceRoutes)
app.use('/customer', customerRoutes)
app.use('/vendorRoutes',vendorRoutes)
const port = process.env.PORT || 4000;
const server = app.listen(port, function(){
    console.log('Listening on port ' + port);
});
