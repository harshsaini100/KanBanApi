import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import getRoutes from "./routes/get.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

// Load the / routes
app.use("/data", getRoutes);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.",err)
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});