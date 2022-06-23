const express = require("express");
const { Parser } = require("json2csv");
const { Timestamp } = require("mongodb");


const contactsRoutes = express.Router();

const dbo = require("../db/conn");

contactsRoutes.route("/contact-message").get(function (req, res) {
  let db_connect = dbo.getDb("users");
  db_connect
    .collection("contacts")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

contactsRoutes.route("/contact-message-csv").get(function (req, res) {
  let db_connect = dbo.getDb("users");
  db_connect
    .collection("contacts")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;

      const dataFields = [
        'Full Name',
        'Email',
        'Message'
      ]

      const opts = {dataFields};

      if(result.length > 0) {
        const CSVData = result.map(item => {
          const {name, email, message} = item; 
          return {
            'Full Name': name,
            'Email' : email, 
            'Message': message
          }
        }); 

        const parser = new Parser(opts); 
        const csv = parser.parse(CSVData); 
        res.send(Buffer.from(csv));
      } else {
        res.json("No data Available");
      }
    });
});


contactsRoutes.route("/contact-message/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
    lastModified: new Timestamp(),
  };
  db_connect.collection("contacts").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

module.exports = contactsRoutes;