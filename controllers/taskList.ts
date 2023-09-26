import { Request, Response, NextFunction } from 'express';
import Task, { ITask } from '../models/task';
import TaskList, {ITaskList} from '../models/taskList';
import User from '../models/user';

// Working with lists
export const createTaskList = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    }
    const { title, description } = req.body;
    const userId:string= req.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            const error: Error = new Error('User Not Found');
            return next(error);
        }

        const list = new TaskList({
            title,
            description,
            tasks: [],
            collaborators: [{userId, status: 'author' }],
        });
        let savedList: ITaskList | null;
        try {
            savedList = await list.save();
            user.taskList.push({ list: savedList._id, status: 'author' });
            await user.save();
        }
        catch (err) {
            const customError= new Error('Server Error');
            return next(customError);
        }

        res.status(201).json({
            message: 'Task List Created Successfully',
            statusCode: 201,
            list: savedList,
        });
    }
    catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }
    
};

export const updateTaskList = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    }
    const { listId, title, description } = req.body;
    const userId:string= req.userId;

    try {
        const list = await TaskList.findById(listId).populate('collaborators');
        if (!list) {
            const error: Error = new Error('List Not Found');
            (error as any).statusCode = 404;
            return next(error);
        }

        const collaborator = list.collaborators.find((collaborator) => collaborator.userId.toString() === userId);

        if (!collaborator || collaborator.status !== 'author') {
            const error: Error = new Error('Unauthorized');
            return next(error);
        }

        if (title) {
            list.title = title;
        }
        if (description) {
            list.description = description;
        }

        const savedList = await list.save();

        res.status(201).json({
            message: 'Task List Updated Successfully',
            statusCode: 201,
            list: savedList,
        });
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }
};

export const deleteTaskList = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    }
    const { listId } = req.body;
    const userId:string= req.userId;

    try {
        const list = await TaskList.findById(listId);

        if (!list) {
            const error: Error = new Error('List Not Found');
            (error as any).statusCode = 404;
            return next(error);
        }

        const collaborator = list.collaborators.find((collaborator) => collaborator.userId.toString() === userId);

        if (!collaborator || collaborator.status !== 'author') {
            const error: Error = new Error('Unauthorized');
            return next(error);
        }

        for (const collaborator of list.collaborators) {
            const user = await User.findById(collaborator.userId).populate('taskList');
            if (user) {
                (user.taskList! as any).pull({ list: listId }); // Assert non-null and use type assertion
                await user.save();
            }
        }
        

        for (const task of list.tasks) {
            await Task.findByIdAndDelete(task.task);
        }

        await TaskList.findByIdAndDelete(listId);

        res.status(201).json({
            message: 'Task List Deleted Successfully',
            statusCode: 201,
        });
    }catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }
};

export const getTaskList = async function (req: Request, res: Response, next: NextFunction): Promise<void> { 
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    }
    const { listId } = req.body;
    const userId: string = req.userId;
    
    try {
        const list = await TaskList.findById(listId).populate('tasks.task').populate('collaborators');

        if (!list) {
            const error: Error = new Error('List Not Found');
            (error as any).statusCode = 404;
            return next(error);
        }

        const collaborator = list.collaborators.find((collaborator) => collaborator.userId.toString() === userId);

        if (!collaborator) {
            const error: Error = new Error('Unauthorized');
            return next(error);
        }

        res.status(201).json({
            message: 'Task List Fetched Successfully',
            statusCode: 201,
            list,
        });
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }
}

// Working with Collaborators
export const addCollaborator = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    }
    const { listId, collaboratorId, status } = req.body;

    try {
        const list = await TaskList.findById(listId);

        if (!list) {
            const error: Error = new Error('List Not Found');
            (error as any).statusCode = 404;
            return next(error);
        }

        (list as any).collaborators.push({ userId: collaboratorId, status });

        await list.save();

        const user = await User.findById(collaboratorId).populate('taskList');
        if (user) {
            (user.taskList! as any).taskList.push({ list: listId, status });
            await user.save();
        }

        res.status(201).json({
            message: 'Collaborator added Successfully',
            statusCode: 201,
            list,
        });
    }catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }
};

export const removeCollaborator = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.auth) {
        const error: Error = new Error('Unauthorized');
        (error as any).statusCode = 401;
        return next(error);
    }
    const { listId, collaboratorId } = req.body;

    try {
        const list = await TaskList.findById(listId);

        if (!list) {
            const error: Error = new Error('List Not Found');
            (error as any).statusCode = 404;
            return next(error);
        }

        (list! as any).list.collaborators.pull({ userId: collaboratorId });
        await list.save();

        const user = await User.findById(collaboratorId).populate('taskList');
        if (user) {
            (user.taskList! as any).pull({ list: listId });
            await user.save();
        }
        res.status(201).json({
            message: 'Collaborator removed Successfully',
            statusCode: 201,
            list,
        });
    }catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }
};

// Working with Tasks
export const addTask = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { listId, title, description } = req.body;
    const userId:string= req.userId;

    try {
        const list = await TaskList.findById(listId).populate('tasks');

        if (!list) {
            const error: Error = new Error('List Not Found');
            (error as any).statusCode = 404;
            return next(error);
        }

        const task = new Task({
            title,
            description,
            status: 'todo',
            collaborators: [],
            userId,
            listId,
        });

        const savedTask = await task.save();
        list.tasks.push({ task: savedTask._id.toString(), status: 'todo' });
        await list.save();

        res.status(201).json({
            message: 'Task created Successfully',
            statusCode: 201,
            task: savedTask,
            list,
        });
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }
};

export const removeTask = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    const { listId, taskId } = req.body;

    try {
        const list = await TaskList.findById(listId).populate('tasks');
        const task = await Task.findById(taskId);

        if (!list) {
            const error: Error = new Error('List Not Found');
            (error as any).statusCode = 404;
            return next(error);
        }

        if (!task) {
            const error: Error = new Error('Task Not Found');
            (error as any).statusCode = 404;
            return next(error);
        }

        if (list.tasks.findIndex((task) => task.task._id.toString() === taskId) === -1) {
            const error: Error = new Error('Task Not Found');
            (error as any).statusCode = 404;
            return next(error);
        }

        (list.tasks! as any).pull({ task: taskId });
        await list.save();

        await Task.findByIdAndDelete(taskId);

        res.status(201).json({
            message: 'Task deleted Successfully',
            statusCode: 201,
            list,
        });
    } catch (err) {
        const customError= new Error('Server Error');
        return next(customError);
    }
};
