const express = require("express");
const router = express();
const stateController = require("../../controller/stateController");

router
  .route("/")
  .get(stateController.getAllStates)
  .post(stateController.addFunFact)
  .put(stateController.updateState)
  .delete(stateController.deleteState);

router.route("/:code").get(stateController.getStateByCode);

router.route("/:code/funfact").get(stateController.getRandomFunFact);

module.exports = router;
