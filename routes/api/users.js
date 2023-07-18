const express = require("express");

const ctrl = require("../../controllers/users");

const {validateBody, authenticate, validateSubscription} = require("../../middlewares");

const {schemas} = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(schemas.authSchema), ctrl.register);

router.post("/login", validateBody(schemas.authSchema), ctrl.login);

router.post("/logout", authenticate, ctrl.logout);

router.get("/current", authenticate, ctrl.getCurrent);

router.patch("/", authenticate, validateSubscription(schemas.subscriptionSchema), ctrl.changeSubscription);

module.exports = router;
