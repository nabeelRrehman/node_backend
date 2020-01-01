const express = require("express");
const app = express.Router();
const Model = require('../model/model');
const moment = require('moment')
//POST REQUEST 



app.post("/add", (req, res) => {

  //get request body 
  Model.voucher.update(
    { "_id": '5dd7d1efb077421fd4f86e40' }, { $set: { [req.body.name]: req.body.data } }, ((err, documents) => {
      res.send(documents)

    }))

})


app.get("/get", (req, res) => {

  //get request body 
  Model.voucher.findOne({ "_id": '5dd7d1efb077421fd4f86e40' })
    .exec()
    .then((article) => {
      //send response article
      res.json(article)
    })
    //catch the error
    .catch((err) => next(err));

})


module.exports = app