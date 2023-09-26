import express from 'express';
import {createUser, updateUser, deleteUser, login,logout, getUser} from '../controllers/user';
import {auth } from '../middleware/auth';
const router = express.Router();

router.post('/create', createUser as any );

router.post('/update', auth as any, updateUser as any );

router.post('/delete', auth as any, deleteUser as any );

router.post('/login',  login as any );

router.post('/logout', auth as any, logout as any );

router.post('/get-user', auth as any, getUser as any );

export default router;


// import { Router } from 'express';

// import { check } from 'express-validator';

// //Controllers
// import userController from '../controllers/user';
// import auth from '../middleware/auth';
// const router = Router( as any );

// router.post('/create',  createUser as any ); //Tested

// router.post('/update',  updateUser as any ); //Tested

// router.post('/delete',  deleteUser as any ); //Tested

// router.post('/login',  login as any ); //Tested

// router.post('/logout',  logout as any ); //Tested

// router.post('/get-user',  getUser as any ); //Tested

// module.exports = router;