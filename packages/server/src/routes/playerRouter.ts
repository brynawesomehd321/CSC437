import express, { Request, Response } from 'express';
import PlayerService from '../services/player-svc';
import { Player } from '../models/player';
import { Stat } from '../models/stat';
import StatService from '../services/stat-svc';

const playerRouter = express.Router();
const playerService = new PlayerService();
const statService = new StatService();

//get list of players
playerRouter.get("/", (_, res: Response) => {
    playerService.index()
        .then((data: Array<Player | undefined>) => res.json(data))
        .catch((err) => res.status(500).send(err));
});

//get player by id
playerRouter.get('/:playerId', (req: Request, res: Response) => {
    const { playerId } = req.params;

    playerService.getPlayerById(Number(playerId))
        .then((data: Player | undefined) => res.json(data))
        .catch((err) => res.status(404).send(err));
});

//get a list of stats for a player
playerRouter.get('/:playerId/stats', (req: Request, res: Response) => {
    const { playerId } = req.params;

    statService.getStatByPlayerId(Number(playerId))
        .then((data: Array<Stat>) => res.json(data))
        .catch((err) => res.status(404).send(err));
});

//create player (playerId, playerName, playerNumber, teamId)
playerRouter.post('/', (req: Request, res: Response) => {
    const newPlayer = req.body;

    playerService.createPlayer(newPlayer)
        .then((data: Player) => res.status(201).json(data))
        .catch((err) => res.status(500).send(err));
})

//update player
playerRouter.put('/:playerId', (req: Request, res: Response) => {
    const updatedPlayer = req.body;
    const { playerId } = req.params;
    playerService.updatePlayer(updatedPlayer, Number(playerId))
        .then((data: Player) => res.json(data))
        .catch((err) => res.status(404).send(err));
});

//delete player
playerRouter.delete('/:playerId', (req: Request, res: Response) => {
    const { playerId } = req.params;
    playerService.removePlayer(Number(playerId))
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default playerRouter;