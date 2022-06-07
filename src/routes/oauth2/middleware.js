const { buildRedirectUrl } = require("../../lib/oauth");

module.exports = {
  addAuthParamsToSession: async (req, res, next) => {
    req.session.authParams = { client_id: req.query.client_id };

    next();
  },

  addJWTToRequest: (req, res, next) => {
    req.jwt = req.query?.request;
    next();
  },

  initSessionWithJWT: async (req, res, next) => {
    if (!req.jwt) {
      return next(new Error("Missing JWT"));
    }

    if (!req.session?.authParams?.client_id) {
      return next(new Error("Missing client_id"));
    }

    const sessionPath = req.app.get("API.PATHS.SESSION");
    if (!sessionPath) {
      return next(new Error("Missing API.PATHS.SESSION value"));
    }

    const requestJWT = req.jwt;
    try {
      if (requestJWT) {
        const apiResponse = await req.axios.post(sessionPath, {
          request: req.jwt,
          client_id: req.session.authParams.client_id,
        });

        req.session.tokenId = apiResponse?.data["session_id"];
        req.session.authParams.state = apiResponse?.data?.state;
        req.session.authParams.redirect_uri = apiResponse?.data?.redirect_uri;
      }
      return next();
    } catch (error) {
      return next(error);
    }
  },

  redirectToCallback: async (req, res, next) => {
    try {
      const redirectUrl = buildRedirectUrl({
        authParams: req.session.authParams,
      });

      return res.redirect(redirectUrl.toString());
    } catch (e) {
      return next(e);
    }
  },

  redirectToEntryPoint: async (req, res, next) => {
    const entryPointPath = req.app.get("APP.PATHS.ENTRYPOINT");
    if (!entryPointPath) {
      return next(new Error("Missing APP.PATHS.ENTRYPOINT value"));
    }

    res.redirect(entryPointPath);
  },
};
