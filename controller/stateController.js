const State = require("../models/State");

// Controller to handle GET /states/
const getAllStates = async (req, res) => {
  try {
    const states = await State.find();
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to handle GET /states/:state
const getStateByCode = async (req, res) => {
  const { stateCode } = req.params;
  try {
    const state = await State.findOne({ stateCode });
    if (state) {
      res.json(state);
    } else {
      res.status(404).json({ error: "State not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to handle GET /states/:state/funfact
const getRandomFunFact = async (req, res) => {
  const { stateCode } = req.params;
  try {
    const state = await State.findOne({ stateCode });
    if (state && state.funfacts.length > 0) {
      const randomIndex = Math.floor(Math.random() * state.funfacts.length);
      res.json({ funfact: state.funfacts[randomIndex] });
    } else {
      res.status(404).json({ error: "No fun facts found for this state" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to handle POST /states/:state/funfact
const addFunFact = async (req, res) => {
  const { stateCode } = req.params;
  const { funfacts } = req.body;
  try {
    let state = await State.findOne({ stateCode });
    if (!state) {
      state = new State({ stateCode, funfacts });
    } else {
      state.funfacts = [...state.funfacts, ...funfacts];
    }
    await state.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllStates,
  getStateByCode,
  getRandomFunFact,
  addFunFact,
};
