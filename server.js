const express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
jsonParser = bodyParser.json(),
cors = require('cors'),
mongoose = require('mongoose'),
withAuth = require('./server/authentication/middleware');
require('dotenv').config()
//api config
const authRoutes = require('./server/authentication/authentication');
const serviceRoutes = require('./server/expressRoutes/serviceRoutes');
const customerRoutes = require('./server/expressRoutes/customerRoutes');
const accountRoutes = require('./server/expressRoutes/accountRoutes');
const vendorRoutes = require('./server/expressRoutes/vendorRoutes');
const petRoutes = require('./server/expressRoutes/petRoutes');
const scheduleRoutes = require('./server/expressRoutes/scheduleRoutes');
const notificationRoutes = require('./server/expressRoutes/notificationRoutes');
const vendorLocationRoutes = require('./server/expressRoutes/vendorLocationRoutes');
const bookingRoutes = require('./server/expressRoutes/bookingRoutes');
const serviceNotificationRoutes = require('./server/expressRoutes/serviceNotificationRoutes');
//connect app to mongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://khanhphung:helloworld@cluster0-mymse.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true').then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

// CORS handle
const app = express();
app.use(bodyParser.json({limit: "50mb"}));
app.use(jsonParser)
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cors());

//Mapping Express Route with Server Route
app.use('/api/account', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', withAuth, serviceRoutes);
app.use('/api/customer', withAuth, customerRoutes);
app.use('/api/vendor', withAuth, vendorRoutes);
app.use('/api/pet',withAuth, petRoutes);
app.use('/api/notification',withAuth, notificationRoutes);

app.use('/api/schedule', withAuth, scheduleRoutes);
app.use('/api/vendorLocation', vendorLocationRoutes);
app.use('/api/booking',withAuth,bookingRoutes);
app.use('/api/serviceNotification', withAuth, serviceNotificationRoutes);

const port = process.env.PORT || 4000;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const server = app.listen(port, function(){
    console.log('Listening on port ' + port);
});
