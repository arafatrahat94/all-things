require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { SMTPClient } = require("../config/db.config");

const smtpCollection = SMTPClient.collection("smtpmails");

const smtpCollectionRoutes = express.Router();

// Apply CORS middleware
smtpCollectionRoutes.use(cors());

smtpCollectionRoutes.post("/NewSmtp", async (req, res) => {
  try {
    const body = req.body;
    if (!body.email) {
      return res.status(400).send({ message: "Email is required" });
    }

    const query = { email: body.email };
    const find = await smtpCollection.findOne(query);
    if (find) {
      return res.status(400).send({ message: "User already exists" });
    }

    const result = await smtpCollection.insertOne(body);
    res.status(201).send(result);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

smtpCollectionRoutes.get("/GetSmtp", async (req, res) => {
  try {
    const result = await smtpCollection.find({}).toArray();
    res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});
smtpCollectionRoutes.patch("/Update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id), email: req.body.email };
    const result = await smtpCollection.updateOne(query);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});
smtpCollectionRoutes.delete("/Delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id), email: req.body.email };
    const result = await smtpCollection.deleteOne(query);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});
module.exports = smtpCollectionRoutes;
