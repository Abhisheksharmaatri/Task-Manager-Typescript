import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';
import User, { IUser } from '../models/user';
import bcrypt, { hash } from 'bcryptjs';
import { jwtSecret } from '../senstive';
import jwt from 'jsonwebtoken';

declare module 'express' {
  interface Request {
    auth: boolean;
    userId: string;
  }
}
export const auth = async function (req: Request, res: Response, next: NextFunction) {
  req.auth = false;
  if (!req.headers.authorization) {
    const error: Error = new Error('Unauthorized');
    (error as any).statusCode = 401;
    return next(error);
}
const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the authorization header

  if (!token) {
    const error: Error = new Error('User Not Found');
    (error as any).statusCode = 404;
    return next(error);
  }

  let user: IUser | null;
  let userId = '';
  try {
    let decodedToken: any;
try {
  decodedToken = jwt.verify(token, jwtSecret);
  console.log('decodedToken: ', decodedToken);
} catch (error) {
  // Handle the verification error (e.g., invalid token format)
  const customError = new Error('Server Error in verifying token');
  return next(customError);
}

// Check if decodedToken has a userId property
if (!decodedToken || !decodedToken.userId) {
  const error: Error = new Error('User Not Found');
  (error as any).statusCode = 404;
  return next(error);
}
console.log(decodedToken)
userId = decodedToken.userId;

    console.log('userId: ', userId)
  } catch (err) {
    const customError = new Error('Server Error');
    return next(customError);
  }
  if (!userId) {
    const error: Error = new Error('User Not Found');
    (error as any).statusCode = 404;
    return next(error);
  }
  try {
    user = await User.findById(userId);
  } catch (err) {
    const customError= new Error('Server Error');
    return next(customError);
}

  if (!user) {
    const error: Error = new Error('User Not Found');
    (error as any).statusCode = 404;
    return next(error);
  }

  console.log('User: ', user.name);
    req.auth = true;
    req.userId = user._id.toString();
  next();
}
// export const auth = async function (req: Request, res: Response, next: NextFunction) {
//   req.auth = false;
//   const userId: string = req.body.userId;

//   if (!userId) {
//     const error: Error = new Error('User Not Found');
//     (error as any).statusCode = 404;
//     return next(error);
//   }

//   let user: IUser | null;
//   try {
//     user = await User.findById(userId);
//   } catch (err) {
//     const customError= new Error('Server Error');
//     return next(customError);
// }

//   if (!user) {
//     const error: Error = new Error('User Not Found');
//     (error as any).statusCode = 404;
//     return next(error);
//   }

//   console.log('User: ', user.name);
//     req.auth = true;
//     req.headers.authorization = user._id.toString();
//   next();
// }



// import { Request, Response, NextFunction } from 'express';
// import { Document } from 'mongoose';
// import User, { UserDocument } from '../models/user';

// export const auth = async function (req: Request, res: Response, next: NextFunction) {
//     req.auth = false;
//     const userId: string = req.body.userId;

//     if (!userId) {
//         const error: Error = new Error('User Not Found');
//         (error as any).statusCode = 404;
//         return next(error);
//     }

//     let user: UserDocument | null;
//     try {
//         user = await User.findById(userId);
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }

//     if (!user) {
//         const error: Error = new Error('User Not Found');
//         (error as any).statusCode = 404;
//         return next(error);
//     }

//     console.log('User: ', user.name);
//     req.auth = true;
//     next();
// }
