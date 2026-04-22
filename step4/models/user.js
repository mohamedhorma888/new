import mongoose from 'mongoose';
import colors from 'colors';
const userschema = new mongoose.Schema({ 
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    password: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 6,
        maxlength: 512,

    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
},{timestamps: true,});

const User = mongoose.model('User', userschema);
export default User;
