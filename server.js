/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);
const express = require('express')


const route = express.Router()

route.use('/user', require('./routes/users'))
route.use('/data', require('./routes/articles'))
route.use('/notification', require('./routes/notifications'))
route.use('/payment', require('./routes/payment'))
route.use('/voucher', require('./routes/voucher'))
route.use('/pushUser', require('./routes/pushUsers'))



module.exports = route