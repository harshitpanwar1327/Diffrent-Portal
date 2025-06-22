import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const adminConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Admin database connected successfully");
    } catch (error) {
        console.log("Admin database connection failed: ", error);
        process.exit(1);
    }
}

export default adminConnect;