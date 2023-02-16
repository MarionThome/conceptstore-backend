var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const User = require("../models/users");

router.post("/signup", (req, res) => {
  if (req.body.username && req.body.password) {
    User.findOne({ username: req.body.username.toLowerCase() }).then((data) => {
      if (data) {
        res.json({ result: false, error: "Username already exist" });
      } else {
        const hash = bcrypt.hashSync(req.body.password, 10);
        const newUser = new User({
          username: req.body.username.toLowerCase(),
          password: hash,
          token: uid2(32),
          pastOrders: [],
          favs: [],
        });
        newUser.save().then((data) => {
          res.json({ result: true, user: { username: data.username, token: data.token } })})
      }
    });
  } else {
    res.json({ result: false, error: "missing or empty fields" });
  }
});

router.post("/signin", (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ username: req.body.username.toLowerCase() }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({
        result: true,
        user: { username: data.username, token: data.token },
      });
    } else {
      res.json({ result: false, error: "invalid username or password" });
    }
  });
});

router.post("/new-order", (req, res) => {
  if (!req.body.token || !req.body.products) {
    res.json({ result: false, error: "Missing informations" });
    return;
  }
  User.findOneAndUpdate(
    { token: req.body.token },
    {
      $push: {
        pastOrders: {
          date: new Date(),
          toTalPrice : req.body.price,
          products: req.body.products,
        },
      },
    }
  ).then((data) => {
    res.json({ result: true });
  });
});

router.get("/past-orders/:token", (req, res) => {
  User.findOne({ token: req.params.token })
    .populate("pastOrders.products")
    .then((data) => {
      if (!data) {
        res.json({ result: false, error: "no past orders" });
      } else {
        res.json({ result: true, orders: data.pastOrders });
      }
    });
});

router.post("/new-fav", (req, res) => {
  if (!req.body.token || !req.body.product) {
    res.json({ result: false, error: "Missing informations" });
    return;
  }
  User.findOneAndUpdate(
    { token: req.body.token },
    {
      $push: {
        favs: req.body.product,
      },
    }
  ).then(() => {
    res.json({ result: true });
  });
});

router.delete("/delete-fav", (req, res) => {
  if (!req.body.token || !req.body.id) {
    res.json({ result: false, error: "Missing informations" });
    return;
  }
  User.updateOne(
    { token: req.body.token },
    {
      $pull: {
        favs: req.body.id,
      },
    }
  ).then(() => {
    res.json({ result: true });
  });
});

router.get("/favorites/:token", (req, res) => {
  User.findOne({ token: req.params.token })
    .populate("favs")
    .then((data) => {
      if (!data) {
        res.json({ result: false, error: "no favorite yet" });
      } else {
        res.json({ result: true, favorites : data.favs});
      }
    });
});

module.exports = router;
