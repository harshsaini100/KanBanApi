import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();


router.get("/all_items", async (req, res) => {
    try{
        let collection = await db.collection("Items");
        let results = await collection.find({})
          .toArray();
        res.send(results).status(200);
    }catch(er){
        throw new Error(er);
    }
});

router.patch("/updateStatus/:id", async (req, res) => {
    try{
        let body = req.body;
        let newStus = body.type;
        let collection = await db.collection("Items")
        const query = {_id : ObjectId(req.params.id)}
        const update = {
            $set: {type:newStus}
        }
        
        let result = await collection.updateOne(query,update)
        res.send("Done").status(200)
    }catch(er){
        console.log(er)
        throw new Error(er)
    }
})

router.delete("/delete/:id", async (req, res) => {
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

router.post("/add", async (req, res) => {
    try{
        let body = req.body;
        let collection = await db.collection("Items")
        let result = await collection.insertOne(body)
        res.send("Done").status(200)
    }catch(er){
        console.log(er)
        throw new Error(er)
    }
})

export default router;