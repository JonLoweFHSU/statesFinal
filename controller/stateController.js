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

// Controller to handle GET /states/:state/capital
const getStateCapital = async (req, res) => {
    const { stateCode } = req.params;
    try {
      const state = await State.findOne({ stateCode });
      if (state && state.capital) {
        res.json({ state: state.stateName, capital: state.capital });
      } else {
        res.status(404).json({ error: "Capital not found for this state" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  // Controller to handle GET /states/:state/nickname
  const getStateNickname = async (req, res) => {
    const { stateCode } = req.params;
    try {
      const state = await State.findOne({ stateCode });
      if (state && state.nickname) {
        res.json({ state: state.stateName, nickname: state.nickname });
      } else {
        res.status(404).json({ error: "Nickname not found for this state" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  // Controller to handle GET /states/:state/population
  const getStatePopulation = async (req, res) => {
    const { stateCode } = req.params;
    try {
      const state = await State.findOne({ stateCode });
      if (state && state.population) {
        res.json({ state: state.stateName, population: state.population });
      } else {
        res.status(404).json({ error: "Population not found for this state" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  // Controller to handle GET /states/:state/admission
  const getStateAdmission = async (req, res) => {
    const { stateCode } = req.params;
    try {
      const state = await State.findOne({ stateCode });
      if (state && state.admissionDate) {
        res.json({ state: state.stateName, admitted: state.admissionDate });
      } else {
        res.status(404).json({ error: "Admission date not found for this state" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

module.exports = {
  getAllStates,
  getStateByCode,
  getRandomFunFact,
  addFunFact,
  getStateCapital,
  getStateNickname,
  getStatePopulation,
  getStateAdmission,
};
