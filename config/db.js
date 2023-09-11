import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URI);
        console.log(`DB Connected successfully. ${mongoose.connection.host}`)
    } catch (error) {
        console.log(`MongoDB error ${error}`);
    }
}

export default connectDB;