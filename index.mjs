import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import tasksRoutes from "./routes/tasks.mjs";
import authRoutes from "./routes/users.mjs";
import projectRoutes from "./routes/projects.mjs";
import connectMongoose from './db/mongoose.mjs';

const PORT = process.env.PORT || 5050;
const app = express();


app.use(cors());
app.use(express.json());

await connectMongoose();

// Load the / routes
app.use("/tasks", tasksRoutes);
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

// Global error handling
app.use((err, _req, res, next) => {
  console.log(err)
  if(err?.name == "ValidationError"){
    const errors = Object.keys(err.errors).map(val => {
      return {
        [val]: err.errors[val].message
      }
    })
    return res.status(400).send({error: errors || "Invalid request"})
  } 
  res.status(500).send({error: "Uh oh! An unexpected error occuredd.",data: err})
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});