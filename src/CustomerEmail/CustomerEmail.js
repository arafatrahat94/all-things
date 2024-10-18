require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { SMTPClient } = require("../config/db.config");
const { ObjectId } = require("mongodb");

const CustomerMailCollection = SMTPClient.collection("CustomerMail");

const CustomerMailCollectionRoutes = express.Router();

CustomerMailCollectionRoutes.use(cors());

CustomerMailCollectionRoutes.post("/NewCustomerEmails", async (req, res) => {
  const body = req.body;

  const query = { "newlist.id": req.body.newlist.id };
  const check = await CustomerMailCollection.findOne(query);

  if (check) {
    const updateData = {
      id: check.newlist.id,
      emails: [...check.newlist.emails, body.newlist.emails],
    };
    const result = await CustomerMailCollection.updateOne(query, {
      $set: updateData,
    });
    res.status(201).send(result);
    console.log(updateData);
  }
  if (!check) {
    const result = await CustomerMailCollection.insertOne(body);
    res.status(201).send(result);
  }
});

// smtpCollectionRoutes.get("/", async (req, res) => {
//   try {
//     const result = await smtpCollection.find({}).toArray();
//     res.status(200).send(result);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).send({ message: "Internal server error" });
//   }
// });
// smtpCollectionRoutes.patch("/Update/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const updateData = req.body.email ? { email: req.body.email } : {};
//     const query = { _id: new ObjectId(id) };

//     const result = await smtpCollection.updateOne(query, { $set: updateData });

//     if (result.modifiedCount === 0) {
//       return res
//         .status(404)
//         .send({ message: "Record not found or no changes made" });
//     }

//     res.status(200).send({ message: "Updated successfully" });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).send({ message: "Internal server error" });
//   }
// });

// smtpCollectionRoutes.delete("/Delete/:id", async (req, res) => {
//   try {
//     console.log(req.params.id);
//     const id = req.params.id;
//     const query = { _id: new ObjectId(id), email: req.body.email };
//     const result = await smtpCollection.deleteOne(query);
//     res.status(200).send(result);
//   } catch (error) {
//     res.status(500).send({ message: "Internal server error" });
//   }
// });
module.exports = CustomerMailCollectionRoutes;
