import express, { Request, Response } from 'express';
import UserService from '../services/user-svc';
import { User } from '../models/user';

const userRouter = express.Router();
const userService = new UserService();

//get list of users
userRouter.get("/", (_, res: Response) => {
    userService.index()
        .then((data: Array<User | undefined>) => res.json(data))
        .catch((err) => res.status(500).send(err));
});

//get user by id
userRouter.get('/:userid', (req: Request, res: Response) => {
    const { userid } = req.params;

    userService.getUserById(Number(userid))
        .then((data: User | undefined) => res.json(data))
        .catch((err) => res.status(404).send(err));
});

//create user (userid, username, email)
userRouter.post('/', (req: Request, res: Response) => {
    const newUser = req.body;

    userService.createUser(newUser)
        .then((data: User) => res.status(201).json(data))
        .catch((err) => res.status(500).send(err));
})

//update user
userRouter.put('/:userid', (req: Request, res: Response) => {
    const updatedUser = req.body;
    const { userid } = req.params;
    userService.updateUser(updatedUser, Number(userid))
        .then((data: User) => res.json(data))
        .catch((err) => res.status(404).send(err));
});

//delete user
userRouter.delete('/:userid', (req: Request, res: Response) => {
    const { userid } = req.params;
    userService.removeUser(Number(userid))
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default userRouter;