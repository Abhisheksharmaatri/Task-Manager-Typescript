import express from 'express';

import {createTask,updateTask, deleteTask, getTask, getAllTasks, addPriorityTask, removePriorityTask, getPriorityTasks, completeTask, uncompleteTask, getCompletedTasks,getUncompletedTasks } from '../controllers/task';
import {  auth } from '../middleware/auth';

const router = express.Router();

router.post('/create',  auth as any  as any,  createTask as any);

router.post('/update',  auth as any  ,  updateTask as any);

router.post('/delete',  auth as any  ,  deleteTask as any);

router.post('/get',  auth as any  ,  getTask as any);

router.post('/get-all',  auth as any  ,  getAllTasks as any);

router.post('/add-priority',  auth as any  ,  addPriorityTask as any);

router.post('/remove-priority',  auth as any  ,  removePriorityTask as any);

router.post('/get-priority',  auth as any  ,  getPriorityTasks as any);

router.post('/complete',  auth as any  ,  completeTask as any);

router.post('/uncomplete',  auth as any  ,  uncompleteTask as any);

router.post('/get-uncompleted',  auth as any  ,  getUncompletedTasks as any);

router.post('/get-completed',  auth as any  ,  getCompletedTasks as any);

export default router;