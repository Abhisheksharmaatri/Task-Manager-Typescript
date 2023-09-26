import mongoose, { Schema, Document } from 'mongoose';

interface ITaskList {
    list: mongoose.Schema.Types.ObjectId;
    status: string;
}

export interface IUser extends Document {
    email: string;
    name: string;
    password: string;
    taskList: ITaskList[];
    verificationStatus: boolean;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    taskList: [
        {
            list: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'TaskList',
            },
            status: String,
        },
    ],
    verificationStatus: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model<IUser>('User', userSchema);


// import { Schema, model } from "mongoose";

// const userSchema = new Schema({
//     email: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     taskList: [{
//         list: {
//             type:  Schema.Types.ObjectId,
//             ref: 'Task-List'
//         },
//         status: String
//     }],
//     verificationStatus: {
//         type: Boolean,
//         default: false
//     }
// });

// module.exports = .model('User', userSchema);