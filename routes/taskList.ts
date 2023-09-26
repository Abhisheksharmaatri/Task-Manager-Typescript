import express from 'express';
import {createTaskList, updateTaskList, deleteTaskList,getTaskList, addCollaborator, removeCollaborator, addTask, removeTask} from '../controllers/taskList';
import {auth} from '../middleware/auth';
const router = express.Router();

router.post('/create',auth as any, createTaskList as any);

router.post('/update', auth as any,updateTaskList as any);

router.post('/delete',  auth as any,deleteTaskList as any);

router.post('/get', auth as any, getTaskList as any);

router.post('/add-collaborator', auth as any, addCollaborator as any);

router.post('/remove-collaborator', auth as any, removeCollaborator as any);

router.post('/addTask', auth as any, addTask as any);

router.post('/removeTask',  auth as any, removeTask as any);

export default router;


// import { Router } from 'express';

// import { check } from 'express-validator';

// //Controllers
// import taskListController from '../controllers/taskList';
// import auth from '../middleware/auth';

// const router = Router();

// router.post('/create', taskListController.createTaskList); //Tested

// router.post('/update', taskListController.updateTaskList); //Tested

// router.post('/delete', taskListController.deleteTaskList); // Tested

// router.post('/add-collaborator', taskListController.addCollaborator); //Tested

// router.post('/remove-collaborator', taskListController.removeCollaborator); //Tested

// router.post('/addTask', taskListController.addTask); //Tested

// router.post('/removeTask', taskListController.removeTask); //Tested

// module.exports = router;