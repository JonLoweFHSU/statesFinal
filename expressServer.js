require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyState = require("./middleware/verifyState");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConfig");
const STATES = require("./states.json");
const State = require("./models/States");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/states/", async (req, res) => {
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

app.get("/states/:state", verifyState, async (req, res) => {
  const state = STATES.find((s) => s.code === req.stateCode);
  const dbState = await State.findOne({ stateCode: req.stateCode });
  if (dbState) {
    state.funfacts = dbState.funfacts;
  }
  res.json(state);
});

app.get("/states/:state/funfact", verifyState, async (req, res) => {
  const dbState = await State.findOne({ stateCode: req.stateCode });
  if (dbState && dbState.funfacts.length > 0) {
    const randomIndex = Math.floor(Math.random() * dbState.funfacts.length);
    res.json({ funfact: dbState.funfacts[randomIndex] });
  } else {
    res.json({ message: "No fun facts available for this state" });
  }
});

app.post("/states/:state/funfact", verifyState, async (req, res) => {
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

app.patch("/states/:state/funfact", verifyState, async (req, res) => {
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

app.delete("/states/:state/funfact", verifyState, async (req, res) => {
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

// Catch-all route for 404
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "public", "404.html"));
  } else {
    res.json({ error: "404 Not Found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
