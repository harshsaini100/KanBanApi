import mongoose from "mongoose";

const projectsSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true
    },
    description: {
        type: String,
        trim:true
    },
    boards: {
        type: Array
    },
    totalBoards: {
        type:Number,
        default: 0
    },
    activeBoards: {
        type: Number,
        default: 0
    },
    completedBoards: {
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

const Project = mongoose.model('Project', projectsSchema)

export default Project