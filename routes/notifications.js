const express = require("express");
const app = express.Router();
const Model = require('../model/model');

//POST REQUEST 


app.post("/logs/add", (req, res) => {

    //get request body 

    var logs = new Model.logs({
        logs: req.body
    })

    logs.save(function (err, succes) {
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

})


app.get("/logs/get", (req, res) => {

    //get request body 

    Model.logs.find()
        .exec()
        .then((article) => {
            //send response article
            res.json(article)
        })
        //catch the error
        .catch((err) => next(err));

})


//add articles in mongodb
app.post("/add", (req, res) => {

    //get request body 

    Model.notification.update(
        { "_id": '5da41c90db99030128dfc330' }, { $set: { [req.body.name]: req.body.data } }, ((err, documents) => {
            res.send(documents)

        }))

})


app.get('/get', (req, res, next) => {

    Model.notification.findOne({ "_id": '5da41c90db99030128dfc330' })
        .exec()
        .then((article) => {
            //send response article
            res.json(article)
        })
        //catch the error
        .catch((err) => next(err));


});



module.exports = app