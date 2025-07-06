import express from "express"
import Project from "../models/Projects.mjs"
import authMiddleware from "../middleware/authMiddleware.mjs";
import { ObjectId } from "mongodb";

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
    try{
        const {name, description} = req.body  
        const createdBy = req?.user?.id
        const newProj = new Project({name, description, createdBy})
        const projects = await newProj.save()
        // const userProjects = projects.filter(val => val.createdBy == ObjectId(createdBy))
        res.status(200).send(projects)
    }catch(er){
        console.log(er)
    }
      
})

router.delete('/delete_project/:id', authMiddleware, async (req, res)=>{
    try{
        const {id} = req.params
        const result = await Project.deleteOne({_id: id})
        res.status(200).send(result)
    }catch(er){
        console.log(er)
    }
})

export default router;