const oAuth = require("./oauth");

const DEFAULT_ERROR_CODE = "server_error";
const DEFAULT_ERROR_DESCRIPTION = "general error";

module.exports = {
  redirectAsErrorToCallback: async (err, req, res, next) => {
    let error = {
      code: DEFAULT_ERROR_CODE,
      description: DEFAULT_ERROR_DESCRIPTION,
    };

    let redirect_uri = req.session.authParams.redirect_uri;

    if (err.isAxiosError) {
      const oauthError = err?.response?.data?.oauth_error;

      error.code = oauthError?.error || error.code;
      error.description = oauthError?.error_description || error.description;
      redirect_uri = err?.response?.data?.redirect_uri || redirect_uri;
    }

    if (err.code === "cri_back_button") {
      error.code = "access_denied";
    }

    try {
      const redirectUrl = oAuth.buildRedirectUrl({
        authParams: {
          error,
          redirect_uri,
        },
      });

      return res.redirect(redirectUrl.toString());
    } catch (e) {
      return next(err);
    }
  },
};
