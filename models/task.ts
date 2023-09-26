import { Schema, model, Document, Types } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description: string;
    due?: Date | null;
    priority: boolean;
    userId: Types.ObjectId;
    listId: Types.ObjectId;
    completed: boolean;
}

const taskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    due: {
        type: Date,
        default: null,
    },
    priority: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    listId: {
        type: Schema.Types.ObjectId,
        ref: 'TaskList',
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

export default model<ITask>('Task', taskSchema);



// import { Schema, model } from "mongoose";

// const taskSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     due: {
//         type: Date
//     },
//     priority: {
//         type: Boolean,
//         default: false
//     },
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     listId: {
//         type: Schema.Types.ObjectId,
//         ref: 'TaskList',
//         required: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// module.exports = model('Task', taskSchema);