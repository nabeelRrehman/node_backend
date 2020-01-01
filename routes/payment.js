const express = require("express");
const app = express.Router();
const Model = require('../model/model');
const moment = require('moment')
const stripe = require('stripe')('sk_live_3yW8QdxDkLhgVjf3iDwsneFf00BNNzMz3z');
//POST REQUEST 


const getDbUser = async (email) => {

  return await Model.Users.findOne({ Email: email })
    .exec()
    .then((article) => {
      //send response article
      return article
    })
    //catch the error
    .catch((err) => err);

}


const updateDbUser = async (customerId, userId, package, user, myvoucher) => {
  if (package.value == 'monthly') {
    var expire = moment().add(1, 'months');
    var arr = user.vouchers.slice(0)
    arr.push(myvoucher)
    return Model.Users.update({ "_id": `${userId}` }, { "$set": { "stripeCustomerId": `${customerId}`, "status": 'paid', "package": package.value, "ExpireOn": expire, "vouchers": arr } }, ((err, documents) => {
      if (!err) {
        return documents
      }
    }))
  } else {
    var expire = moment().add(1, 'year');
    var arr = user.vouchers.slice(0)
    arr.push(myvoucher)
    return Model.Users.update({ "_id": `${userId}` }, { "$set": { "stripeCustomerId": `${customerId}`, "status": 'paid', "package": package.value, "ExpireOn": expire, "vouchers": arr } }, ((err, documents) => {
      if (!err) {
        return documents
      }
    }))
  }


}


const findOrCreateStripeCustomer = async (dbUser, tokenId) => {
  if (!!dbUser.stripeCustomerId) {
    return stripe.customers
      .createSource(dbUser.stripeCustomerId, { source: tokenId })
      // This Stripe service returns a source object
      .then(newSource => {
        return stripe.customers
          .update(dbUser.stripeCustomerId, { default_source: newSource.id })
      })
  } else { // First payment
    return stripe.customers.create({
      email: dbUser.Email,
      source: tokenId
    })
  }
}

const addPayment = (obj) => {

  var paymentCreate = new Model.payment({
    Email: obj.email,
    name: obj.name,
    stripeCustomerId: obj.stripeCustomerId,
    price: obj.price,
    currency: 'sek',
    package: obj.package,
    voucher: obj.voucher,
  })

  paymentCreate.save(function (err, succes) {
    if (!err) {
      return succes
    }
    else {
      return err
      // res.send({ message: err })
    }
  });
}



app.post("/", (req, res) => {

  //get request body 
  getDbUser(req.body.email) // Some method to get a user from the database
    .then(dbUser => {
      return findOrCreateStripeCustomer(dbUser, req.body.tokenId)
    }) // This Stripe service returns a customer object
    .then(stripeCustomer => {
      var obj = {
        value: req.body.selectedPackage.image,
      }
      var voucher = req.body.selectedPackage.voucher;
      updateDbUser(stripeCustomer.id, req.body.userId, obj, req.body.userData, voucher) // Save your Stripe customer ID for the next time
      return stripe.charges.create({
        amount: req.body.amount * 100, // Unit: cents
        currency: 'sek',
        customer: stripeCustomer.id,
        source: stripeCustomer.default_source,
        description: 'Test payment',
      })
    })
    .then((result) => {

      const obj = {
        email: req.body.email,
        stripeCustomerId: result.customer,
        price: req.body.amount,
        name: req.body.userData.name,
        package: req.body.selectedPackage.name,
        voucher: req.body.selectedPackage.voucher,
      }

      addPayment(obj)

      res.status(200).send(result)

    })

})



module.exports = app