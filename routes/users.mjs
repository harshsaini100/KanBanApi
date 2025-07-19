import express from 'express';
import User from '../models/User.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        res.status(500).json({ error: err.message });
    }
})

router.post('/login', async (req, res) =>{
    const {email, password} = req.body
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).send({error:"Invalid Credentials!"})
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).send({error:"Invalid Credentials!"})
        
        const token = await jwt.sign({id:user._id}, process.env.JWT_SECRET)
        res.status(200).send({ token, user: { id: user._id, name: user.name, email: user.email } });
    }catch(er){
      res.status(500).send({ error: err.message });
    }
})

router.get('/wakeup', async (req, res) => {
    res.status(200).send({ message: "Server is up and running!" });
});

export default router;