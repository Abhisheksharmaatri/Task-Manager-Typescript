import { Request, Response, NextFunction } from 'express';
import Task, { ITask } from '../models/task';
import TaskList, {ITaskList} from '../models/taskList';
export const createTask = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    }

    const { title, description, dueDate, listId } = req.body;
    const userId: string = req.userId;
    const due: Date = new Date(dueDate);
    
    let list: ITaskList | null;

    try {
        list = await TaskList.findById(listId);
    } catch (err) {
        console.log(err);
        const customError= new Error('Server Error');
        return next(customError);
    }

    if (!list) {
        const error: Error = new Error('List Not Found');
        (error as any).statusCode = 404;
        return next(error);
    }

    const task = new Task({
        title,
        description,
        due: due,
        userId,
        listId,
    });

    try {
        const savedTask = await task.save();
        list.tasks.push({ task: savedTask._id, status: 'author' });
        await list.save();
        res.status(201).json({
            message: 'Task Created Successfully',
            statusCode: 201,
            task: savedTask,
        });
    } catch (err) {
        console.log(err);
        const customError= new Error('Task not saved.');
        return next(customError);
    }
 };

export const updateTask = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    }

    const { title, description, dueDate, taskId } = req.body;

    let task:ITask|null;

    try {
        task = await Task.findById(taskId);
    } catch (err) {
        console.log(err);
        const customError= new Error('Server Error');
        return next(customError);
    }

    if (!task ||!task.due ||!task.description ||!task.title) {
        const error: Error = new Error('Task Not Found');
        (error as any).statusCode = 404;
        return next(error);
    }
    if (task.userId.toString() !== req.userId.toString()) { 
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    }

        if (title) {
            task.title = title;
        }
        if (description) {
            task.description = description;
        }
        if (dueDate) {
            task.due = dueDate;
        }

        try {
            const savedTask = await task.save();
            res.status(201).json({
                message: 'Task Updated Successfully',
                statusCode: 201,
                task: savedTask,
            });
        } catch (err) {
        console.log(err);
            const customError= new Error('Server Error');
            return next(customError);
        }
};

export const deleteTask = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    }

    const { taskId } = req.body;
    const userId:string= req.userId;
    let task:ITask|null;

    try {
        task = await Task.findById(taskId);
    }catch (err) {
        console.log(err);
        const customError= new Error('Server Error');
        return next(customError);
    }

    if (!task) {
        console.log(task);
        const error: Error = new Error('Task not Found');
        (error as any).statusCode = 404;
        return next(error);
    }
    let list: ITaskList | null;
    try { 
        list = await TaskList.findById(task.listId);
    }
    catch (err) {
        console.log(err);
        const customError = new Error('Server Error');
        return next(customError);
    }
    if (!list) {
        const error: Error = new Error('List not Found');
        (error as any).statusCode = 404;
        return next(error);
    }
    if (task.userId.toString() !== userId.toString()) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        next(error);
    }
    try {
        task = await Task.findByIdAndRemove(taskId);
        list.tasks = list.tasks.filter((task) => task.task.toString() !== taskId.toString());
        await list.save();
    } catch (err) {
console.log(err);
        const customError = new Error('Server Error');
        return next(customError);
    }

    res.status(200).json({
        message: 'Task Deleted Successfully',
        statusCode: 200,
        task,
    });
};

export const getTask = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    } else {
        const taskId = req.body.taskId;
        let task:ITask|null;

        try {
            task = await Task.findById(taskId);
        } catch (err) {
        console.log(err);
            const customError= new Error('Server Error');
            return next(customError);
        }

        if (!task) {
            const error: Error = new Error('Task not Found');
            (error as any).statusCode = 404;
            return next(error);
        } else {

            if (task.userId.toString() !== req.userId) {
                const error: Error = new Error('Unauthorized');
                (error as any).statusCode = 401;
                return next(error);
            }

            res.status(200).json({
                message: 'Task Found',
                statusCode: 200,
                task,
            });
        }
    }
};

export const getAllTasks = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    } else {

        const userId:string= req.userId;
        let tasks:any;

        try {
            tasks = await Task.find({ userId });
            res.status(200).json({
                message: 'Tasks Found',
                statusCode: 200,
                tasks,
            });
        } catch (err) {
        console.log(err);
            const customError= new Error('Server Error');
            return next(customError);
        }
    }
};

export const addPriorityTask = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    } else {

        const { taskId, userId } = req.body;
        let task:ITask|null;

        try {
            task = await Task.findById(taskId);
        }catch (err) {
        console.log(err);
            const customError= new Error('Server Error');
            return next(customError);
        }

        if (!task) {
            const error: Error = new Error('Task not Found');
            (error as any).statusCode = 404;
            next(error);
        } else {

            if (task.userId.toString() !== userId.toString()) {
                const error: Error = new Error('Unauthorized');
                (error as any).statusCode = 401;
                next(error);
            }

            task.priority = true;

            try {
                const savedTask = await task.save();
                res.status(200).json({
                    message: 'Task Priority Added',
                    statusCode: 200,
                    task: savedTask,
                });
            } catch (err) {
        console.log(err);
                const customError = new Error('Server Error');
                return next(customError);
            }
        }
    }
};

export const removePriorityTask = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    } else {

        const { taskId, userId } = req.body;
        let task;

        try {
            task = await Task.findById(taskId);
        }catch (err) {
        console.log(err);
            const customError= new Error('Server Error');
            return next(customError);
        }

        if (!task) {
            const error: Error = new Error('Task not Found');
            (error as any).statusCode = 404;
            return next(error);
        }

        if (task.userId.toString() !== userId.toString()) {
            const error: Error = new Error('Unauthorized');
            (error as any).statusCode = 401;
            return next(error);
        }

        task.priority = false;

        try {
            const savedTask = await task.save();
            res.status(200).json({
                message: 'Task Priority Removed',
                statusCode: 200,
                task: savedTask,
            });
        } catch (err) {
        console.log(err);
            const customError= new Error('Server Error');
            return next(customError);
        }
    }
};

export const getPriorityTasks = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    } else {

        const userId = req.body.userId;
        let tasks;

        try {
            tasks = await Task.find({ priority: true, userId });
            res.status(200).json({
                message: 'Priority Tasks Found',
                statusCode: 200,
                tasks,
            });
        } catch (err) {
        console.log(err);
            const customError= new Error('Server Error');
            return next(customError);
        }
    }
};

export const completeTask = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    } else {

        const { taskId, userId } = req.body;
        let task;

        try {
            task = await Task.findById(taskId);
        } catch (err) {
        console.log(err);
            const customError= new Error('Server Error');
            return next(customError);
        }
        if (!task) {
            const error: Error = new Error('Task Not Found');
            (error as any).statusCode = 404;
            return next(error);
        }

        if (task.userId.toString() !== userId.toString()) {
            const error: Error = new Error('Unauthorized');
            (error as any).statusCode = 401;
            return next(error);
        }

        task.completed = true;

        try {
            const savedTask = await task.save();
            res.status(200).json({
                message: 'Task Completed',
                statusCode: 200,
                task: savedTask,
            });
        }catch (err) {
        console.log(err);
            const customError= new Error('Server Error');
            return next(customError);
        }
    }
};

export const uncompleteTask = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        next(error);
    } else {

        const { taskId, userId } = req.body;
        let task;

        try {
            task = await Task.findById(taskId);
        } catch (err) {
        console.log(err);
            const customError= new Error('Server Error');
            return next(customError);
        }
        if (!task) {
            const error: Error = new Error('Task Not Found');
            (error as any).statusCode = 404;
            return next(error);
        }

        if (task.userId.toString() !== userId.toString()) {
            const error: Error = new Error('Unauthorized');
            (error as any).statusCode = 401;
            next(error);
        }

        task.completed = false;

        try {
            const savedTask = await task.save();
            res.status(200).json({
                message: 'Task Uncompleted',
                statusCode: 200,
                task: savedTask,
            });
        } catch (err) {
        console.log(err);
            const customError= new Error('Server Error');
            return next(customError);
        }
    }
};

export const getCompletedTasks = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    } else {

        const userId = req.body.userId;
        let tasks;

        try {
            tasks = await Task.find({ completed: true, userId });
            res.status(200).json({
                message: 'Completed Tasks Found',
                statusCode: 200,
                tasks,
            });
        } catch (err) {
        console.log(err);
            const customError= new Error('Server Error');
            return next(customError);
        }
    }
};

export const getUncompletedTasks = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        next(error);
    } else {

        const userId = req.body.userId;
        let tasks;

        try {
            tasks = await Task.find({ completed: false, userId });
            res.status(200).json({
                message: 'Uncompleted Tasks Found',
                statusCode: 200,
                tasks,
            });
        } catch (err) {
        console.log(err);
            const customError = new Error('Server Error');
            return next(customError);
        }
    }
};


// import { Request, Response, NextFunction } from 'express';
// import mongoose, { Document } from 'mongoose';

// // Models
// import Task, { ITask } from '../models/task';

// export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void>: Promise<void> => {
//     if (!req.auth) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     const title: string = req.body.title;
//     const description: string = req.body.description;
//     const dueDate: Date = new Date(req.body.dueDate);
//     const listId: string = req.body.listId;
//     const userId: string = req.body.userId;

//     const task: ITask = new Task({
//         title: title,
//         description: description,
//         due: dueDate,
//         userId: userId,
//         listId: listId,
//     });
//     let savedTask: ITask | undefined;
//     try {
//         savedTask = await task.save();
//     } catch (err) {
//         err.message = 'Task Not Saved';
//         return next(err);
//     }
//     return res.status(201).json({
//         message: 'Task Created Successfully',
//         statusCode: 201,
//         task: savedTask,
//     });
// };

// export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void>: Promise<void> => {
//     if (!req.auth) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     const title: string = req.body.title;
//     const description: string = req.body.description;
//     const dueDate: Date = new Date(req.body.dueDate);

//     const taskId: string = req.body.taskId;
//     let task: ITask | null;
//     try {
//         task = await Task.findById(taskId);
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }

//     if (!task) {
//         const error: Error = new Error('Server Error');
//         (error as any).statusCode = 404;
//         return next(error);
//     }

//     if (title) {
//         task.title = title;
//     }
//     if (description) {
//         task.description = description;
//     }
//     if (dueDate) {
//         task.dueDate = dueDate;
//     }

//     let savedTask: ITask | undefined;
//     try {
//         savedTask = await task.save();
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }
//     return res.status(201).json({
//         message: 'Task Updated Successfully',
//         statusCode: 201,
//         task: savedTask,
//     });
// };

// export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void>: Promise<void> => {
//     if (!req.auth) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     const taskId: string = req.body.taskId;
//     const userId: string = req.body.userId;

//     let task: ITask | null;
//     try {
//         task = await Task.findById(taskId);
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }

//     if (!task) {
//         const error: Error = new Error('Task not Found');
//         (error as any).statusCode = 404;
//         return next(error);
//     }
//     if (task.userId.toString() !== userId.toString()) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     try {
//         task = await Task.findByIdAndRemove(taskId);
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }

//     return res.status(200).json({
//         message: 'Task Deleted Successfully',
//         statusCode: 200,
//         task: task,
//     });
// };

// export const getTask = async (req: Request, res: Response, next: NextFunction): Promise<void>: Promise<void> => {
//     if (!req.auth) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     const taskId: string = req.body.taskId;

//     let task: ITask | null;
//     try {
//         task = await Task.findById(taskId);
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }

//     if (!task) {
//         const error: Error = new Error('Task not Found');
//         (error as any).statusCode = 404;
//         return next(error);
//     }
//     if (task.userId.toString() !== req.userId.toString()) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     return res.status(200).json({
//         message: 'Task Found',
//         statusCode: 200,
//         task: task,
//     });
// };

// export const getAllTasks = async (req: Request, res: Response, next: NextFunction): Promise<void>: Promise<void> => {
//     if (!req.auth) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     const userId: string = req.body.userId;
//     let tasks: ITask[] | null;

//     try {
//         tasks = await Task.find({
//             userId: userId,
//         });
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }
//     return res.status(200).json({
//         message: 'Tasks Found',
//         statusCode: 200,
//         tasks: tasks,
//     });
// };

// export const addPriorityTask = async (req: Request, res: Response, next: NextFunction): Promise<void>: Promise<void> => {
//     if (!req.auth) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     const taskId: string = req.body.taskId;
//     const userId: string = req.body.userId;
//     let task: ITask | null;
//     try {
//         task = await Task.findById(taskId);
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }

//     if (!task) {
//         const error: Error = new Error('Task not Found');
//         (error as any).statusCode = 404;
//         return next(error);
//     }
//     if (task.userId.toString() !== userId.toString()) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     task.priority = true;

//     let savedTask: ITask | undefined;
//     try {
//         savedTask = await task.save();
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }

//     return res.status(200).json({
//         message: 'Task Priority Added',
//         statusCode: 200,
//         task: savedTask,
//     });
// };

// export const removePriorityTask = async (req: Request, res: Response, next: NextFunction): Promise<void>: Promise<void> => {
//     if (!req.auth) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     const taskId: string = req.body.taskId;
//     const userId: string = req.body.userId;
//     let task: ITask | null;
//     try {
//         task = await Task.findById(taskId);
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }

//     if (!task) {
//         const error: Error = new Error('Task not Found');
//         (error as any).statusCode = 404;
//         return next(error);
//     }
//     if (task.userId.toString() !== userId.toString()) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     task.priority = false;

//     let savedTask: ITask | undefined;
//     try {
//         savedTask = await task.save();
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }

//     return res.status(200).json({
//         message: 'Task Priority Removed',
//         statusCode: 200,
//         task: savedTask,
//     });
// };

// export const getPriorityTasks = async (req: Request, res: Response, next: NextFunction): Promise<void>: Promise<void> => {
//     if (!req.auth) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     const userId: string = req.body.userId;
//     let tasks: ITask[] | null;
//     try {
//         tasks = await Task.find({
//             priority: true,
//             userId: userId,
//         });
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }

//     return res.status(200).json({
//         message: 'Priority Tasks Found',
//         statusCode: 200,
//         tasks: tasks,
//     });
// };

// export const completeTask = async (req: Request, res: Response, next: NextFunction): Promise<void>: Promise<void> => {
//     if (!req.auth) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     const taskId: string = req.body.taskId;
//     const userId: string = req.body.userId;

//     let task: ITask | null;
//     try {
//         task = await Task.findById(taskId);
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }
//     if (task.userId.toString() !== userId.toString()) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }
//     task.completed = true;
//     let savedTask: ITask | undefined;
//     try {
//         savedTask = await task.save();
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }
//     return res.status(200).json({
//         message: 'Task Completed',
//         statusCode: 200,
//         task: savedTask,
//     });
// };

// export const uncompleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void>: Promise<void> => {
//     if (!req.auth) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     const taskId: string = req.body.taskId;
//     const userId: string = req.body.userId;

//     let task: ITask | null;
//     try {
//         task = await Task.findById(taskId);
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }
//     if (task.userId.toString() !== userId.toString()) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }
//     task.completed = false;
//     let savedTask: ITask | undefined;
//     try {
//         savedTask = await task.save();
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }
//     return res.status(200).json({
//         message: 'Task uncompleted',
//         statusCode: 200,
//         task: savedTask,
//     });
// };

// export const getCompletedTasks = async (req: Request, res: Response, next: NextFunction): Promise<void>: Promise<void> => {
//     if (!req.auth) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     const userId: string = req.body.userId;
//     let tasks: ITask[] | null;
//     try {
//         tasks = await Task.find({
//             completed: true,
//             userId: userId,
//         });
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }
//     return res.status(200).json({
//         message: 'Completed Tasks Found',
//         statusCode: 200,
//         tasks: tasks,
//     });
// };

// export const getUncompletedTasks = async (req: Request, res: Response, next: NextFunction): Promise<void>: Promise<void> => {
//     if (!req.auth) {
//         const error: Error = new Error('Unauthorized');
//         (error as any).statusCode = 401;
//         return next(error);
//     }

//     const userId: string = req.body.userId;
//     let tasks: ITask[] | null;
//     try {
//         tasks = await Task.find({
//             completed: false,
//             userId: userId,
//         });
//     } catch (err) {
//         err.message = 'Server Error';
//         return next(err);
//     }
//     return res.status(200).json({
//         message: 'Uncompleted Tasks Found',
//         statusCode: 200,
//         tasks: tasks,
//     });
// };



// // import Task from '../models/task';

// // module.exports = {
// //     createTask: async (req, res, next) => { 
// //         if (!req.auth) {
// //             const error = new Error('Unauthorized');
// //             error.statusCode = 401;
// //             return next(error);
// //         }
    
// //         const title = req.body.title;
// //         const description = req.body.description;
// //         const dueDate = req.body.dueDate;
// //         const listId = req.body.listId;
// //         const userId = req.body.userId;
    
// //         const task = new Task({
// //             title: title,
// //             description: description,
// //             due: dueDate,
// //             userId: userId,
// //             listId: listId
// //         });
// //         let savedTask;
// //         try {
// //             savedTask = task.save();
// //         } catch (err) {
// //             err.message = 'Task Not Saved';
// //             next(err);
// //         }
// //         return res.status(201).json({
// //             message: 'Task Created Successfully',
// //             statusCode: 201,
// //             task: savedTask
// //         });
// //     },
    
// //     updateTask: async (req,res, next) => { },
    
// //     deleteTask: async (req,res, next) => { },
    
// //     getTask: async (req,res, next) => { },
    
// //     getAllTask: async (req,res, next) => { },
    
// //     addPriorityTask: async (req,res, next) => { },
    
// //     removePriorityTask: async (req,res, next) => { },
    
// //     getPriorityTask: async (req,res, next) => { },
    
// //     completeTask: async (req,res, next) => { },
    
// //     uncompleteTask: async (req,res, next) => { },
    
// //     getCompletedTask: async (req,res, next) => { },
    
// //     getUncompletedTask: async (req,res, next) => { },
// // }