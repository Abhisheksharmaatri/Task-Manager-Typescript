import { Schema, model, Document } from 'mongoose';

interface ISession extends Document {
    userId: Schema.Types.ObjectId;
    token: string;
}

const sessionSchema = new Schema<ISession>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

export default model<ISession>('Session', sessionSchema);



// import {Schema, model} from "mongoose";

// const sessionSchema = new Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     token: {
//         type: String,
//         required: true
//     }
// });

// module.exports = model('Session', sessionSchema);