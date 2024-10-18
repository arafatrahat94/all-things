const express = require("express");
const bodyParser = require("body-parser");
const { dbConnection } = require("./src/config/db.config");
const smtpCollectionRoutes = require("./src/Smtp/smtp");

const app = express();
app.use(bodyParser.json());

app.use("/api", smtpCollectionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await dbConnection();
});
