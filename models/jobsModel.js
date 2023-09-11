import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide the company name']
    },
    position: {
        type: String,
        required: [true, 'Please provide your position'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ["pending", "reject", "interview"],
        default: "pending"
    },
    workType: {
        type: String,
        enum: ["Full-time", "Part time", "Internship", "Contract"],
        default: "Full-time"
    },
    workLocation: {
        type: String,
        enum: ["Islamabad", "Peshawar", "Lahore"],
        default: "Islamabad"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});

export default mongoose.model('Jobs', jobSchema);