require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");
const app = express();

const port = 8080;
app.use(
  express.json({
    limit: "5mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cors());

const stripeWebhook = require("./routes/stripe");
const descriptionRouter = require("./routes/description");

app.use("/stripe", stripeWebhook);
app.use("/api/descriptions", descriptionRouter);
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
