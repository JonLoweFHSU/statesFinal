const states = require("../states.json");

const verifyState = (req, res, next) => {
  const stateCode = req.params.state.toUpperCase();
  if (states.includes(stateCode)) {
    req.stateCode = stateCode;
    next();
  } else {
    res.status(400).json({ error: "Invalid state code" });
  }
};

module.exports = verifyState;
