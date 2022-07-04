module.exports = {
  markSessionAsComplete: (req, res, next) => {
    if (req.session) {
      req.session.complete = true;
    }

    return next();
  },

  checkForSessionComplete: (req, res, next) => {
    if (req.session && req.session.complete) {
      const err = new Error("CRI revisiting");
      err.code = "cri_back_button";
      return next(err);
    }

    return next();
  },
};
