import express from "express"
import Project from "../models/Projects.mjs"
import authMiddleware from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.get('/all_items', authMiddleware, async (req,res)=>{
    try{
        const user_id = req?.user.id;
        const records = Project.find({createdBy: user_id})
        res.status(200).send(records)
    }catch(er){
        throw new Error(er)
    }
})

router.post('/add_project', authMiddleware, async (req, res)=>{
    const {title, description} = req.body
    try{
        const createdBy = req?.user?.id
        const newProj = new Project({title, description, createdBy})
        const a = await newProj.create()
        res.status(200).send(a)
    }catch(er){
        throw new Error(er)
    }
})

export default router;