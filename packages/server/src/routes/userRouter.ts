import express, { Request, Response } from 'express';
import UserService from '../services/user-svc';

const router = express.Router();

router.get('/users/:id', async (req: Request, res: Response) => {
    
})