import express from "express";
import Board from "../models/Boards.mjs";
import Project from "../models/Projects.mjs";
import authMiddleware from "../middleware/authMiddleware.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/all_Board", authMiddleware, async (req, res) => {
  try {
    const Board = await Board.find({});
    res.status(200).send(Board);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/boards_by_project/:id", authMiddleware, async (req, res) => {
  try {
    const projId = req.params.id;
    const qry = [
      { 
        $match:
         { $expr : { 
          $eq: [ '$project' , { $toObjectId: projId } ]
         } 
        } 
      },
     
  {
    $lookup:
    
      {
        from: "Items",
        localField: "_id",
        foreignField: "board_id",
        as: "items"
      }
  },
  {
    $addFields:
      /**
       * newField: The new field name.
       * expression: The new field expression.
       */
      {
        totalTasks: {
          $size: "$items"
        },
        todoTasks: {
          $size: {
            $filter: {
              input: "$items",
              as: "task",
              cond: {
                $eq: ["$$task.type", "todo"]
              }
            }
          }
        },
        inProgressTasks: {
          $size: {
            $filter: {
              input: "$items",
              as: "task",
              cond: {
                $eq: ["$$task.type", "inprogress"]
              }
            }
          }
        },
        completedTasks: {
          $size: {
            $filter: {
              input: "$items",
              as: "task",
              cond: {
                $eq: ["$$task.type", "complete"]
              }
            }
          }
        }
      }
  },
  {
    $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        items: 0,
        tasks: 0
      }
  }
] 
   const boards = await Board.aggregate(qry);
    
    res.status(200).send(boards);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post("/create_board", authMiddleware, async (req, res) => {
  try {
    const { name, description, project } = req.body;
    const newBoard = new Board({ name, description, project });
    const board = await newBoard.save();
    res.status(201).send(board);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ error: errors.join(", ") });
    }
    res.status(500).json({ error: err.message });
  }
});

router.patch("/update_board/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const board = await Board.findOneAndUpdate(
      { _id: id },
      { $set: { name, description } },
      { new: true }
    );
    res.status(200).send(board);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/get_board/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const board = await Board.findOne({ _id: id });
    const projId = board.project;
    const proj = await Project.findOne({ _id: ObjectId(projId) });
    board.project_name = proj.name;
    res.status(200).send(board);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.delete("/delete_board/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Board.deleteOne({ _id: id });
    res.status(200).send({ id });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default router;
