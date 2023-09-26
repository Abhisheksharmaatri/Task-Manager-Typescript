import { Request, Response, NextFunction } from 'express';
import Task from '../models/task';
import TaskList from '../models/taskList';
import User, { IUser } from '../models/user';
import Session from '../models/session';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const senstive = require('../senstive'); // Make sure to handle sensitive data properly in your actual application.

// Create a new user
export const createUser = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, name, password } = req.body;
    let hashedPW:string;

    try {
        hashedPW = await bcrypt.hash(password, 12);
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }

    let existingUser:IUser|null;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }

    const user = new User({
        email,
        name,
        password: hashedPW,
        taskList: [],
    });

    let savedUser:IUser|null;

    try {
        savedUser = await user.save();
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }

    res.status(201).json({
        message: 'User Created Successfully',
        statusCode: 201,
    });
};

// Update user information
export const updateUser = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email:email, name:name, password:password } = req.body;

    let user:IUser|null;

    try {
        user = await User.findOne({ email: email });
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }

    if (!user) {
        const error: Error = new Error('User Not Found');
        (error as any).statusCode = 404;
        return next(error);
    }

    let isEqual:boolean = false;

    try {
        isEqual = await bcrypt.compare(password, user.password);
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }

    if (!isEqual) {
        const error: Error = new Error('Wrong Password');
        (error as any).statusCode = 401;
        return next(error);
    }

    if (name) {
        user.name = name;
    }

    try {
        await user.save();
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }

    res.status(200).json({
        message: 'User Updated Successfully',
        statusCode: 200,
    });
};

// Delete a user
export const deleteUser = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;

    let user;

    try {
        user = await User.findOne({ email: email });
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }

    if (!user) {
        const error: Error = new Error('User Not Found');
        (error as any).statusCode = 404;
        return next(error);
    }

    let isEqual = false;

    try {
        isEqual = await bcrypt.compare(password, user.password);
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }

    if (!isEqual) {
        const error: Error = new Error('Wrong Password');
        (error as any).statusCode = 401;
        return next(error);
    }

    try {
        await User.findByIdAndDelete(user._id);
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }
    res.status(200).json({
        message: 'User Deleted Successfully',
        statusCode: 200,
    });
};

// User login
export const login = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    let user:IUser|null;

    try {
        user = await User.findOne({ email: email });
    }catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }

    if (!user) {
        const error: Error = new Error('User Not Found');
        (error as any).statusCode = 404;
        return next(error);
    }

    let isEqual = false;

    try {
        isEqual = await bcrypt.compare(password, user.password);
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }

    if (!isEqual) {
        const error: Error = new Error('Wrong Password');
        (error as any).statusCode = 401;
        return next(error);
    }

    let token;

    try {
        token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString(),
            },
            senstive.jwtSecret,
            {
                expiresIn: '1h',
            }
        );
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }

    const session = new Session({
        token: token,
        userId: user._id.toString(),
    });

    try {
        await session.save();
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }

    res.status(200).json({
        message: 'User Logged In Successfully',
        statusCode: 200,
        token: token,
        userId: user._id.toString(),
    });
};

// User logout
export const logout = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.headers.authorization) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    }
        const token:string = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the authorization header
    
    try {
        await Session.deleteOne({
            token: token,
        });
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }

    res.status(200).json({
        message: 'User Logged Out Successfully',
        statusCode: 200,
    });
};

// Get user information
export const getUser = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
   let user:IUser|null;

    try {
        user = await User.findById(req.userId).populate('taskList.list');
    } catch (err) {
        console.log(err);
        const customError= new Error('Server Error');
        return next(customError);
    }

    if (!user) {
        const error: Error = new Error('User Not Found');
        (error as any).statusCode = 404;
        return next(error);
    }

    const sessionUser = {
        email: user.email,
        name: user.name,
        taskList: user.taskList,
    };

    res.status(200).json({
        message: 'User Found',
        statusCode: 200,
        user: sessionUser,
    });
};
