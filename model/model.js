const mongoose = require('mongoose');
var SALT_FACTOR = 10;
var bcrypt = require("bcrypt-nodejs");
var expireDate = 1209600000   //14 days
// var expireDate = 900000   //15 min



//mongoDb collection schema for register users
var UsersSchema = mongoose.Schema({
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    name: { type: String, required: true },
    region: { type: String, required: true },
    token: { type: String, required: false },
    checklists: { type: Object, required: false },
    notification: { type: Array, required: false },
    vouchers: { type: Array, default: [] },
    status: { type: String, default: 'trial' },
    stripeCustomerId: { type: String, required: false },
    package: { type: String, required: false },
    CreatedOn: { type: Date, default: Date.now() },
    ExpireOn: { type: Date, default: Date.now() + expireDate },
});

var PushUsersSchema = mongoose.Schema({
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, default: 'pushUser' },
    CreatedOn: { type: Date, default: Date.now() },
});

//mongoDb collection schema for post An Article
var ArticleSchema = mongoose.Schema({
    languages: { type: Object, required: true },
});

var NotificationSchema = mongoose.Schema({
    notification: { type: Object, required: true },
    emergencyNotification: { type: Object, required: true },
    logs: { type: Object, required: false },
});

var NotificationLogsSchema = mongoose.Schema({
    logs: { type: Object, required: false },
});

var PaymentsSchema = mongoose.Schema({
    Email: { type: String, required: true },
    stripeCustomerId: { type: String, required: true },
    price: { type: Number, required: true },
    package: { type: String, required: true },
    name: { type: String, required: true },
    currency: { type: String, required: true },
    voucher: { type: String, required: true },
    date: { type: Date, default: Date.now() },
});


var VoucherSchema = mongoose.Schema({
    vouchers: { type: Array, required: false },
});


PushUsersSchema.pre("save", function (done) {
    var user = this;

    if (!user.isModified("Password")) {
        return done();
    }
    //generating a hash password using bcrypt
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            console.log(err, 'salt err');
            //catch the error
            return done(err);
        }
        bcrypt.hash(user.Password, salt, function () { }, function (err, hashedPassword) {
            if (err) {
                //if error
                //catch the error
                return done(err);
            }
            // console.log(hashedPassword, 'hashedPassword')
            //if success
            //set user password to generated encrypt password 
            user.Password = hashedPassword;
            done();
        });
    });
});


UsersSchema.pre("save", function (done) {
    var user = this;

    if (!user.isModified("Password")) {
        return done();
    }
    //generating a hash password using bcrypt
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            console.log(err, 'salt err');
            //catch the error
            return done(err);
        }
        bcrypt.hash(user.Password, salt, function () { }, function (err, hashedPassword) {
            if (err) {
                //if error
                //catch the error
                return done(err);
            }
            // console.log(hashedPassword, 'hashedPassword')
            //if success
            //set user password to generated encrypt password 
            user.Password = hashedPassword;
            done();
        });
    });
});

//users schema
const Users = mongoose.model('Users', UsersSchema);
//articles schema
const Articles = mongoose.model('data', ArticleSchema);
const notification = mongoose.model('notification', NotificationSchema);
const logs = mongoose.model('logs', NotificationLogsSchema);
const payment = mongoose.model('payment', PaymentsSchema);
const voucher = mongoose.model('voucher', VoucherSchema);
const pushUser = mongoose.model('pushUser', PushUsersSchema);



const obj = {
    Users,
    Articles,
    notification,
    logs,
    payment,
    voucher,
    pushUser
}
//export object contain users,articles
module.exports = obj;