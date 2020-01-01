const express = require("express");
const app = express.Router();
const newUsers = require('../model/model');
var bcrypt = require("bcrypt-nodejs");


//POST REQUEST
//register new user in database

app.post("/signup", function (req, res) {
    //create a new user 
    var userCreate = new newUsers.Users({
        Email: req.body.email,
        Password: req.body.password,
        name: req.body.name,
        region: req.body.region
    })

    //save the user in database
    userCreate.save(function (err, succes) {
        if (!err) {
            //if success
            //send the response
            res.send(succes)
        }
        else {
            //if error
            //send error
            res.send({ message: err })
        }
    });
});

//signing and check the user is available in database

app.post("/signIn", function (req, res) {

    newUsers.Users
        //find user entered email exist in database 
        .findOne({ Email: req.body.email }, function (err, success) {
            //decrypting the hash password
            if (!err && success !== null) {
                //match the user entered password and decrypted password
                bcrypt.compare(req.body.password, success.Password, function (error, isMatch) {
                    if (!error && isMatch === true) {
                        //if match
                        //send response 
                        res.send(success);
                    }
                    else if (isMatch && isMatch === false) {
                        res.send(success);
                    }
                    else {
                        //if not match
                        //send error
                        res.send({ message: 'Incorrect Password' });
                    }
                })
            }
            else if (success === null) {
                //if user email or password is incorrect
                res.send({ message: 'incorrect useremail or password' });
            }
            else {
                //if user doesnot exists in database
                //catch error
                res.send({ message: 'Something went wrong' });
            }

        })

})


app.get('/get/:email', (req, res, next) => {

    newUsers.Users.findOne({ Email: req.params.email })
        .exec()
        .then((article) => {
            //send response article
            res.json(article)
        })
        //catch the error
        .catch((err) => res.send(err));


});


app.post('/addToken', (req, res, next) => {

    newUsers.Users.update({ "_id": `${req.body._id}` }, { "$set": { "token": `${req.body.token}` } }, ((err, documents) => {
        if (!err) {
            res.send(documents)
        }
    }))


});


app.get('/getUsers', (req, res, next) => {

    newUsers.Users.find()
        .exec()
        .then((article) => {
            //send response article
            res.json(article)
        })
        //catch the error
        .catch((err) => res.send(err));

});


app.post('/settings', (req, res, next) => {

    console.log(req.body, 'request body here')

    newUsers.Users.update({ "_id": `${req.body._id}` }, { "$set": { [`settings.${req.body.name}`]: req.body.value } }, ((err, documents) => {
        if (!err) {
            res.send(documents)
        }
    }))


});


app.post('/checkLists', (req, res, next) => {


    newUsers.Users.update({ "_id": `${req.body._id}` }, { "$set": { [`checklists.${req.body.language}`]: req.body.value } }, ((err, documents) => {
        if (!err) {
            res.send(documents)
        }
    }))


});


app.post('/notification', (req, res, next) => {

    newUsers.Users.update({ "_id": `${req.body._id}` }, { "$set": { [`notification`]: req.body.value } }, ((err, documents) => {
        if (!err) {
            res.send(documents)
        }
    }))


});


module.exports = app;