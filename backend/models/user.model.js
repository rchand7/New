// models/user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true,
    },
    profile: {
        profilePhoto: {
            type: String,
            required: false,
        },
        bio: {
            type: String,
            required: false,
        },
        skills: {
            type: [String],
            required: false,
        },
        resume: {
            type: String,
            required: false,
        },
        resumeOriginalName: {
            type: String,
            required: false,
        },
    },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
