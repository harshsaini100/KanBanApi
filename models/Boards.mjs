import mongoose from "mongoose";

const boardsSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Board name is required"],
        trim: true
    },
    description: {
        type: String,
        trim:true
    },
    project: {
        required: [true, "Project is required"],
        type: mongoose.Schema.Types.ObjectId
    },
    tasks: {
        type: Array
    },
    totalTasks: {
        type:Number,
        default: 0
    },
    todoTasks: {
        type: Number,
        default: 0
    },
    inProgressTasks: {
        type: Number,
        default: 0
    },
    completedTasks: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId        
    }

})

const Board = mongoose.model('Board', boardsSchema)

export default Board