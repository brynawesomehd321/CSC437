import express, { Request, Response } from 'express';
import GameService from '../services/game-svc';
import { Game } from '../models/game';
import { Stat } from '../models';
import StatService from '../services/stat-svc';

const gameRouter = express.Router();
const gameService = new GameService();
const statService = new StatService();

//get list of games
gameRouter.get("/", (_, res: Response) => {
    gameService.index()
        .then((data: Array<Game | undefined>) => res.json(data))
        .catch((err) => res.status(500).send(err));
});

//get game by id
gameRouter.get('/:gameId', (req: Request, res: Response) => {
    const { gameId } = req.params;

    gameService.getGameById(Number(gameId))
        .then((data: Game | undefined) => res.json(data))
        .catch((err) => res.status(404).send(err));
});

//get a list of individual stats per game
gameRouter.get('/:gameId/stats', (req: Request, res: Response) => {
    const { gameId } = req.params;

    statService.getStatsByGameId(Number(gameId))
    .then((data: Array<Stat>) => res.json(data))
    .catch((err) => res.status(404).send(err));
});

//create game (location, date, teamId)
gameRouter.post('/', (req: Request, res: Response) => {
    const newGame = req.body;

    gameService.createGame(newGame)
        .then((data: Game) => res.status(201).json(data))
        .catch((err) => res.status(500).send(err));
})

//update game
gameRouter.put('/:gameId', (req: Request, res: Response) => {
    const updatedGame = req.body;
    const { gameId } = req.params;
    gameService.updateGame(updatedGame, Number(gameId))
        .then((data: Game) => res.json(data))
        .catch((err) => res.status(404).send(err));
});

//delete game
gameRouter.delete('/:gameId', (req: Request, res: Response) => {
    const { gameId } = req.params;
    gameService.removeGame(Number(gameId))
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default gameRouter;