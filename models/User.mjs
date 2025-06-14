import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true        
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next){
    try{
        if(!this.isModified('password')) return next()
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
    }catch(er){
            next(er)
    }
})

userSchema.methods.isValidPassword = async function (password) {
    try{
        return await bcrypt.compare(password, this.password)
    }catch(er){
        throw new Error(er)
    }
}

const User = mongoose.model('User', userSchema);

export default User