import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import authMiddleware from "../middleware/authMiddleware.mjs";
import Tasks from "../models/Tasks.mjs";

const router = express.Router();


router.get("/all_items", authMiddleware, async (req, res) => {
    try{
        const user = req.user
        const results = await Tasks.find({user_id: user.id})       
        res.status(200).send(results);
    }catch(er){
        throw new Error(er);
    }
});

router.patch("/updateStatus/:id", authMiddleware, async (req, res) => {
    try{
        let body = req.body;
        let newStus = body.type;
        let collection = await db.collection("Items")
        const query = {_id : ObjectId(req.params.id)}
        const update = {
            $set: {type:newStus}
        }        
        let result = await collection.updateOne(query,update)
        res.json("Done").status(200)
    }catch(er){
        throw new Error(er)
    }
})

router.delete("/delete/:id",authMiddleware, async (req, res) => {
    try{
        let collection = await db.collection("Items")
        const query = {_id : ObjectId(req.params.id)}
        let result = await collection.deleteOne(query)
        res.send("Done").status(200)
    }catch(er){
        console.log(er)
        throw new Error(er)
    }
})

router.post("/add", authMiddleware , async (req, res) => {
    try{
        const user = req.user
        let body = req.body;
        body.user_id = ObjectId(user.id)
        const response = await Tasks.create(body);
        res.status(200).json(response)
    }catch(er){
        console.log(er)
        throw new Error(er)
    }
})

export default router;