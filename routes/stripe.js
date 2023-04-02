const express = require("express"),
  router = express.Router();
const { stripeWebhook } = require("../controllers/stripe");

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

module.exports = router;
