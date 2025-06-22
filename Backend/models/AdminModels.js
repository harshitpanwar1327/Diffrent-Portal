import mongoose, {Schema} from 'mongoose'

const adminSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

export const adminModel = mongoose.model("Admin", adminSchema);