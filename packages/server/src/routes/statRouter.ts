import express, { Request, Response } from 'express';
import StatService from '../services/stat-svc';
import { Stat } from '../models/stat';

const statRouter = express.Router();
const statService = new StatService();

//get list of stats
statRouter.get("/", (_, res: Response) => {
    statService.index()
        .then((data: Array<Stat | undefined>) => res.json(data))
        .catch((err) => res.status(500).send(err));
});

//get stat by id
statRouter.get('/:statId', (req: Request, res: Response) => {
    const { statId } = req.params;

    statService.getStatById(Number(statId))
        .then((data: Stat | undefined) => res.json(data))
        .catch((err) => res.status(404).send(err));
});

//create stat (statId, statType, playerId, gameId)
statRouter.post('/', (req: Request, res: Response) => {
    const newStat = req.body;

    statService.createStat(newStat)
        .then((data: Stat) => res.status(201).json(data))
        .catch((err) => res.status(500).send(err));
})

//update stat
statRouter.put('/:statId', (req: Request, res: Response) => {
    const updatedStat = req.body;
    const { statId } = req.params;
    statService.updateStat(updatedStat, Number(statId))
        .then((data: Stat) => res.json(data))
        .catch((err) => res.status(404).send(err));
});

//delete stat
statRouter.delete('/:statId', (req: Request, res: Response) => {
    const { statId } = req.params;
    statService.removeStat(Number(statId))
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default statRouter;