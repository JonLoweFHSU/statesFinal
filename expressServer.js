require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConfig");

const app = express();
const PORT = process.env.PORT || 3000;

// Connecting to Database
connectDB();

// Custom Middleware Logger
app.use(logger);
// CORS
app.use(cors(corsOptions));



// API router for states
app.use("/api/states", require("./routes/api/states"));

// 404 route for un-defined
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
      res.json({ error: "404 Not Found" });
    } else {
      res.type("txt").send("404 Not Found");
    }
  });

// Error Logger
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is listing on port ${PORT}`);
  });
});