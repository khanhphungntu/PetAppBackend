const express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cors = require('cors'),
mongoose = require('mongoose'),
withAuth = require('./server/authentication/middleware');

//api config
const authRoutes = require('./server/authentication/authentication');
const serviceRoutes = require('./server/expressRoutes/serviceRoutes');
const customerRoutes = require('./server/expressRoutes/customerRoutes');
const accountRoutes = require('./server/expressRoutes/accountRoutes');
const vendorRoutes = require('./server/expressRoutes/vendorRoutes');
const petRoutes = require('./server/expressRoutes/petRoutes');
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
app.use('/api/account', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/service', withAuth, serviceRoutes);
app.use('/api/customer', withAuth, customerRoutes);
app.use('/api/vendor', withAuth, vendorRoutes);
app.use('/api/pet',petRoutes);

const port = process.env.PORT || 4000;
const server = app.listen(port, function(){
    console.log('Listening on port ' + port);
});
