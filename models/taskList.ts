import { Schema, model, Document, Types } from 'mongoose';

export interface ITaskList extends Document {
    title: string;
    description: string;
    tasks: Array<{ task: Types.ObjectId; status: string }>;
    collaborators: Array<{ userId: Types.ObjectId; status: string }>;
}

const taskListSchema = new Schema<ITaskList>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tasks: [
        {
            task: {
                type: Schema.Types.ObjectId,
                ref: 'Task',
            },
            status: String,
        },
    ],
    collaborators: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            status: String,
        },
    ],
});

export default model<ITaskList>('TaskList', taskListSchema);


// import { Schema, model } from "mongoose";
// const taskListSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     tasks: [{
//         task: {
//             type: Schema.Types.ObjectId,
//             ref: 'Task'
//         },
//         status: String
//     }],
//     collaborators: [{
//         userId: {
//             type:Schema.Types.ObjectId,
//             ref: 'User'
//         },
//         status: String
//     }]
// });

// module.exports = model('Task-List', taskListSchema);