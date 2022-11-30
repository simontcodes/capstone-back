const express = require("express");
const router = express.Router();
// const fs = require("fs");
const utils = require("../Utils/Utils");
//importing uuid to make unique ids for every item
const uuid = require("uuid");
//importing knex to do queries on the DB mySQL
const knex = require("knex")(require("../knexfile"));
//unique ids
const { v4: uuidv4 } = require("uuid");
//importing stripe
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const storeItems = [
  { id: 1, priceInCents: 10000, name: "30 MIN CONSULTATION" },
  { id: 2, priceInCents: 15000, name: "1 HOUR CONSULTATION" },
  { id: 3, priceInCents: 25000, name: "PROGRAM OPTION CONSULTATION" },
];

router.route("/").post(async (req, res) => {
  try {
    const foundUser = await knex
      .select("*")
      .from("client")
      .where({ email: req.body.email });

    //checks if user already exist in DB with email
    if (foundUser.length) {
      return res.status(401).json({ message: "User already exist" });
    }

    const items = JSON.parse(req.body.items);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => {
        const storeItem = storeItems.find((product) => {
          return product.id === item.id;
        });
        console.log(storeItem);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/booking`,
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: "Payment could not be completed" });
  }
});

module.exports = router;
