const stripe_key = process.env["STRIPE_API_KEY"];
const stripe = require("stripe")(stripe_key);
const { client } = require("../database");

const stripeWebhook = (request, response) => {
  const sig = request.headers["stripe-signature"];
  const endpointSecret = process.env["STRIPE_WEBHOOK_SECRET"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      sig,
      endpointSecret
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    console.log(err);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "customer.created":
      const customerCreated = event.data.object;
      // Then define and call a function to handle the event customer.created
      console.log("Customer created event");
      addCustomer(customerCreated);
      break;
    case "customer.subscription.created":
      const customerSubscriptionCreated = event.data.object;
      console.log("Customer subscription created event");
      addCustomerSubscription(customerSubscriptionCreated);
      break;
    case "customer.subscription.deleted":
      const customerSubscriptionDeleted = event.data.object;
      console.log("Customer subscription deleted event");
      deleteCustomerSubscription(customerSubscriptionDeleted);
      break;
    case "customer.subscription.updated":
      console.log("Customer subscription updated event");
      const customerSubscriptionUpdated = event.data.object;
      addCustomerSubscription(customerSubscriptionUpdated);
      break;
    default:
      break;
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

const addCustomer = (event) => {
  const customers = client.db("listing-genius-db").collection("customers");

  let customer = {
    email: event.email,
    stripe_customer_id: event.id,
  };

  customers.insertOne(customer, function (err, res) {
    if (err) throw err;
  });
};

const addCustomerSubscription = (event) => {
  const customers = client.db("listing-genius-db").collection("customers");

  let query = {
    stripe_customer_id: event.customer,
  };

  let data = {
    stripe_subscription_id: event.id,
    stripe_subscription_status: event.status,
    stripe_price_id: event.items.data[0].id,
  };

  let newValues = {
    $set: data,
  };

  customers.updateOne(query, newValues, (err, result) => {
    if (err) throw err;
  });
};

const deleteCustomerSubscription = (event) => {
  const customers = client.db("listing-genius-db").collection("customers");
  let query = {
    stripe_customer_id: event.customer,
  };
  let data = {
    $unset: {
      stripe_subscription_id: "",
      stripe_subscription_status: "",
      stripe_price_id: "",
    },
  };

  customers.updateOne(query, data, (err, result) => {
    if (err) throw err;
  });
};

module.exports = {
  stripeWebhook,
};
