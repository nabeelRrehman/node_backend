const express = require("express");
const app = express.Router();
const Model = require('../model/model');

//POST REQUEST 

//add articles in mongodb
app.post("/add", (req, res) => {

    //get request body 

    let myData


    myData = `languages.${req.body.language}.${req.body.title}.${req.body.name}`


    Model.Articles.update(
        { "_id": '5d7110801905780531032309' }, { $set: { [myData]: req.body.data } }, ((err, documents) => {
            res.send(documents)

        }))

})



app.post("/add/:id", (req, res) => {

    //get request body 

    if (req.params && req.params.id) {
        const myData = `languages.${req.body.language}.${req.params.id}`

        Model.Articles.update(
            { "_id": '5d7110801905780531032309' }, { $set: { [myData]: req.body.data } }, ((err, documents) => {
                res.send(documents)

            }))
    }

})


//GET REQUEST

//get articles from mongoDb 
app.get('/get', (req, res, next) => {

    Model.Articles.findOne({ "_id": '5d7110801905780531032309' })
        .exec()
        .then((article) => {
            //send response article
            res.json(article)
        })
        //catch the error
        .catch((err) => next(err));


});




module.exports = app;