import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import authMiddleware from "../middleware/authMiddleware.mjs";
import Tasks from "../models/Tasks.mjs";
import Board from "../models/Boards.mjs";

const router = express.Router();


router.get("/all_items", authMiddleware, async (req, res) => {
    try {
        const user = req.user
        const results = await Tasks.find({ user_id: user.id })
        res.status(200).send(results);
    } catch (er) {
        throw new Error(er);
    }
});

router.patch("/updateStatus/:id", authMiddleware, async (req, res) => {
    try {
        let body = req.body;
        let newStus = body.type;
        let collection = await db.collection("Items")
        const query = { _id: ObjectId(req.params.id) }
        const update = {
            $set: { type: newStus }
        }
        // let out = await Tasks
        let result = await collection.updateOne(query, update)
        res.status(200).send(result)
    } catch (er) {
        throw new Error(er)
    }
})

router.delete("/delete/:id", authMiddleware, async (req, res) => {


    const query = { _id: ObjectId(req.params.id) }
    let taskdtls = await Tasks.findOne(query);
    console.log(taskdtls)
    console.log(taskdtls.board_id)
    let boardid = taskdtls.board_id;
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid Task ID" });
    }
    if (!ObjectId.isValid(boardid)) {
        return res.status(400).json({ error: "Invalid Board ID" });
    }
    const taskId = new ObjectId(req.params.id);
    const boardObjectId = new ObjectId(boardid);
    await Board.updateOne(
        { _id: taskdtls.board_id },
        { $pull: { tasks: taskdtls._id } }
    );
    // if(taskdtls){
    //     let board_id = taskdtls.board_id;
    //     console.log(board_id)
    //     await Board.updateOne({ _id: board_id }, { $pull: { tasks: query._id } });
    // }
    let result = await Tasks.deleteOne(query)
    // await Board.updateOne({  }, { $pull: { tasks: query._id } });
    res.status(200).send(result)

})

router.post("/add", authMiddleware, async (req, res) => {
    try {
        const user = req.user
        let body = req.body;
        body.user_id = ObjectId(user.id)
        const response = await Tasks.create(body);
        const newTaskId = response._id;
        const boardId = body.board_id;
        await Board.updateOne({ _id: boardId }, { $push: { tasks: newTaskId } });
        res.status(200).json(response)
    } catch (er) {
        console.log(er)
        throw new Error(er)
    }
})

router.get("/by_board/:id", authMiddleware, async (req, res) => {
    try {
        let collection = await db.collection("Items")
        const query = { board_id: ObjectId(req.params.id) }
        let result = await collection.find(query).toArray()
        res.status(200).send(result)
    } catch (er) {
        console.log(er)
        throw new Error(er)
    }
})

export default router;