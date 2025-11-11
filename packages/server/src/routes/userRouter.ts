import express, { Request, Response } from 'express';
import UserService from '../services/user-svc';
import { User } from '../models/user';
import TeamService from '../services/team-svc';

const userRouter = express.Router();
const userService = new UserService();
const teamsService = new TeamService();

//get list of users
userRouter.get("/", (_, res: Response) => {
    userService.index()
        .then((data: Array<User | undefined>) => res.json(data))
        .catch((err) => res.status(500).send(err));
});

//get user by id
userRouter.get('/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;

    userService.getUserById(Number(userId))
        .then((data: User | undefined) => res.json(data))
        .catch((err) => res.status(404).send(err));
});

//create user (userId, fullName, email)
userRouter.post('/', (req: Request, res: Response) => {
    const newUser = req.body;

    userService.createUser(newUser)
        .then((data: User) => res.status(201).json(data))
        .catch((err) => res.status(500).send(err));
})

//update user
userRouter.put('/:userId', (req: Request, res: Response) => {
    const updatedUser = req.body;
    const { userId } = req.params;
    userService.updateUser(updatedUser, Number(userId))
        .then((data: User) => res.json(data))
        .catch((err) => res.status(404).send(err));
});

//delete user
userRouter.delete('/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    userService.removeUser(Number(userId))
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default userRouter;