const express = require("express");

const router = express.Router();

const {
  addAuthParamsToSession,
  redirectToCallback,
  initSessionWithJWT,
  redirectToEntryPoint,
  addJWTToRequest,
  retrieveAuthorizationCode,
} = require("./middleware");

const { markSessionAsComplete } = require("../../lib/session-complete");
router.get(
  "/authorize",
  addAuthParamsToSession,
  addJWTToRequest,
  initSessionWithJWT,
  redirectToEntryPoint
);
router.get(
  "/callback",
  retrieveAuthorizationCode,
  markSessionAsComplete,
  redirectToCallback
);

module.exports = router;
