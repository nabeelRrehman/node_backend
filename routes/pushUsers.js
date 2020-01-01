const express = require("express");
const app = express.Router();
const Users = require('../model/model');
var bcrypt = require("bcrypt-nodejs");


//POST REQUEST
//register new user in database

app.post("/add", function (req, res) {
    //create a new user 
    var pushUserCreate = new Users.pushUser({
        Email: req.body.email,
        Password: req.body.password,
        name: req.body.username,
    })

    //save the user in database
    pushUserCreate.save(function (err, succes) {
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

    Users.pushUser
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

app.get('/get', (req, res, next) => {

    Users.pushUser.find()
        .exec()
        .then((article) => {
            //send response article
            res.json(article)
        })
        //catch the error
        .catch((err) => res.send(err));

});

app.delete('/delete', (req, res, next) => {

    Users.pushUser.deleteOne({ _id: req.body.id }, (err, success) => {
        if (!err) {
            res.send(success)
        }
    })

});



module.exports = app;