import mongoose from 'mongoose';

const connectMongoose = async () => {
    const connectionString = process.env.ATLAS_URI || "";
    await mongoose.connect(connectionString);
    console.log("✅ Connected to MongoDB via Mongoose");
};

export default connectMongoose;