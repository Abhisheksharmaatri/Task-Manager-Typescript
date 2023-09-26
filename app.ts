// Packages
import path from 'path';
import fs from 'fs';
import http from 'http';
import express from 'express';

// Sensitive Data
import {EmailApiKey, databaseUrl, testDatabaseUrl, jwtSecret,apiEmailAccount} from './senstive';

// Third Party Packages
import bodyParser from 'body-parser';

// Database Packages
import mongoose from 'mongoose';
import mongodb from 'mongodb';

// Routes
import taskListRouter from './routes/taskList';
import userRouter from './routes/user';
import taskRouter from './routes/task';

// Controllers
import {error} from './controllers/error';

// Setups
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('Body: ', req.body);
    console.log('Params: ', req.params);
    console.log('Query: ', req.query);
    next();
});

app.use('/task', taskRouter);
app.use('/list', taskListRouter);
app.use('/user', userRouter);

app.use(error as any);

// Database Setup
mongoose
    .connect(testDatabaseUrl)
    .then(result => {
        console.log('Connected');
        app.listen(4000);
    })
    .catch(err => {
        console.log(err);
    });


// import express from 'express';
// import bodyparser from 'body-parser';
// import mongoose from 'mongoose';


// import senstive from './senstive';

// //Routes
// import taskListRouter from './routes/taskList'
// import taskRouter from './routes/task'
// import userRouter from './routes/user'
// import errorRouter from './controllers/error'

// const app = express();
// app.use(bodyparser.json());
// app.use(bodyparser.urlEncoded({
//     extended:true
// }))

// app.use('/', (req, res, next) => {
//     console.log('Body: ', req.body)
//     console.log('Params: ', req.params)
//     console.log('Query: ', req.query);
//     next();
// })
// app.use('/task', taskRouter);

// app.use('/list', taskListRouter); //Tested

// app.use('/user', userRouter); //Tested

// app.use(errorRouter.error);

// mongoose
//     .connect(senstive.databaseUrl)
//     .then(result => {
//         console.log('connected');
//         app.listen(4000);
//     })
//     .catch(err => {
//         console.log(err);
//     });