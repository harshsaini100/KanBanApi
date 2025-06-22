import mongoose from "mongoose";


const tasksSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    type: {
        type: String,
        enum: ['todo', 'inprogress', 'completed'],
        required: [true, "Task type is required"],
    },
    description: {
        type: String,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



const Items = mongoose.model('Items', tasksSchema, 'Items');

export default Items