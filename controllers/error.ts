import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

export const error: ErrorRequestHandler = async function (err: Error, req, res, next) {
    console.log(err);

    const message = err.message;
    let statusCode: number;

    switch (message) {
        case 'Server Error':
            statusCode = 500;
            break;
        case 'User Not Found':
        case 'List Not Found':
        case 'Task Not Found':
            statusCode = 404;
            break;
        case 'Wrong Password':
        case 'Unauthorized':
            statusCode = 401;
            break;
        case 'User Already Exists':
            statusCode = 409;
            break;
        default:
            statusCode = 404;
    }

    res.status(statusCode).json({
        message,
        statusCode,
        error: err,
    });
};



// exports.error = async function (err, req, res, next) {

//     console.log(err);

//     const message = err.message;
//     if (message === 'Server Error') {
//         return res.status(500).json({
//             message: 'Server Error',
//             statusCode: 500,
//             error: err
//         });
//     }
//     if (message === 'User Not Found') {
//         return res.status(404).json({
//             message: 'User Not Found',
//             statusCode: 404,
//             error: err
//         });
//     }

//     if (message === 'Wrong Password') {
//         return res.status(401).json({
//             message: 'Wrong Password',
//             statusCode: 401,
//             error: err
//         });
//     }
//     if (message === 'User Already Exists') {
//         return res.status(409).json({
//             message: 'User Already Exists',
//             statusCode: 409,
//             error: err
//         });
//     }
//     if (message === 'List Not Found') {
//         return res.status(404).json({
//             message: 'List Not Found',
//             statusCode: 404,
//             error: err
//         });
//     }
//     if (message === 'Task Not Found') {
//         return res.status(404).json({
//             message: 'Task Not Found',
//             statusCode: 404,
//             error: err
//         });
//     }
//     if (message === 'Unauthorized') {
//         return res.status(401).json({
//             message: 'Unauthorized',
//             statusCode: 401,
//             error: err
//         });
//     }
//     return res.status(404).json({
//         message: 'some error',
//         statusCode: 404,
//         error: err
//     });
// };