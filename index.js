require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 8080;

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
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
