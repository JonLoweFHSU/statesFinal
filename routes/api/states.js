const express = require("express");
const router = express();
const verifyState = require("../middleware/verifyState");
const State = require("../models/State");


// GET /states
router.get("/", async (req, res) => {
  let data = STATES;
  if (req.query.contig === "true") {
    data = data.filter((state) => state.contiguous);
  } else if (req.query.contig === "false") {
    data = data.filter((state) => !state.contiguous);
  }
  const states = await State.find();
  data.forEach((state) => {
    const dbState = states.find((s) => s.stateCode === state.code);
    if (dbState) {
      state.funfacts = dbState.funfacts;
    }
  });
  res.json(data);
});

// GET /states/:state
router.get("/:state", verifyState, async (req, res) => {
  const state = STATES.find((s) => s.code === req.stateCode);
  const dbState = await State.findOne({ stateCode: req.stateCode });
  if (dbState) {
    state.funfacts = dbState.funfacts;
  }
  res.json(state);
});

// GET /states/:state/funfact
router.get("/:state/funfact", verifyState, async (req, res) => {
  const dbState = await State.findOne({ stateCode: req.stateCode });
  if (dbState && dbState.funfacts.length > 0) {
    const randomIndex = Math.floor(Math.random() * dbState.funfacts.length);
    res.json({ funfact: dbState.funfacts[randomIndex] });
  } else {
    res.json({ message: "No fun facts available for this state" });
  }
});

// POST /states/:state/funfact
router.post("/:state/funfact", verifyState, async (req, res) => {
  const { funfacts } = req.body;
  if (!Array.isArray(funfacts)) {
    return res.status(400).json({ error: "Fun facts must be an array" });
  }
  const dbState = await State.findOneAndUpdate(
    { stateCode: req.stateCode },
    { $push: { funfacts } },
    { new: true, upsert: true }
  );
  res.json(dbState);
});

// PATCH /states/:state/funfact
router.patch("/:state/funfact", verifyState, async (req, res) => {
  const { index, funfact } = req.body;
  if (!index || !funfact) {
    return res.status(400).json({ error: "Index and funfact are required" });
  }
  const dbState = await State.findOne({ stateCode: req.stateCode });
  if (!dbState || !dbState.funfacts[index - 1]) {
    return res.status(404).json({ error: "Fun fact not found" });
  }
  dbState.funfacts[index - 1] = funfact;
  await dbState.save();
  res.json(dbState);
});

// DELETE /states/:state/funfact
router.delete("/:state/funfact", verifyState, async (req, res) => {
  const { index } = req.body;
  if (!index) {
    return res.status(400).json({ error: "Index is required" });
  }
  const dbState = await State.findOne({ stateCode: req.stateCode });
  if (!dbState || !dbState.funfacts[index - 1]) {
    return res.status(404).json({ error: "Fun fact not found" });
  }
  dbState.funfacts.splice(index - 1, 1);
  await dbState.save();
  res.json(dbState);
});

// Export the router
module.exports = router;
