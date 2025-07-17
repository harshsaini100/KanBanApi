import express from "express"
import Project from "../models/Projects.mjs"
import authMiddleware from "../middleware/authMiddleware.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get('/all_items', authMiddleware, async (req,res)=>{
    try{
        const user_id = req?.user.id;
        const records = await Project.find({createdBy: ObjectId(user_id)})
        res.status(200).send(records)
    }catch(er){
    //   console.log(er)
    res.status(500).send(er)
    }
})

router.post('/add_project', authMiddleware, async (req, res)=>{
    try{
        const {name, description} = req.body  
        const createdBy = req?.user?.id
        const newProj = new Project({name, description, createdBy})
        const project = await newProj.save()
        // const userProjects = projects.filter(val => val.createdBy == ObjectId(createdBy))
        res.status(200).send(project)
    }catch(er){
        console.log(er)
    }
      
})

router.delete('/delete_project/:id', authMiddleware, async (req, res)=>{
    try{
        const {id} = req.params
        const result = await Project.deleteOne({_id: id})
        res.status(200).send({id:id})
    }catch(er){
        console.log(er)
    }
})

router.get('/get_project/:id', authMiddleware, async (req, res)=>{
    try{
        const {id} = req.params
        const result = await Project.findOne({_id: id})
        res.status(200).send(result)
    }catch(er){
        console.log(er)
    }
})

export default router;