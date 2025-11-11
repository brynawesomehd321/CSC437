import express, { Request, Response } from 'express';
import TeamService from '../services/team-svc';
import { Team } from '../models/team';
import { Player } from '../models/player';
import PlayerService from '../services/player-svc';

const teamRouter = express.Router({ mergeParams: true });
const teamService = new TeamService();
const playerService = new PlayerService();

//get list of teams for the user
teamRouter.get("/", (req: Request, res: Response) => {
    const { userId } = req.params;

    teamService.index(Number(userId))
        .then((data: Array<Team | undefined>) => res.json(data))
        .catch((err) => res.status(500).send(err));
});

//get team by id
teamRouter.get('/:teamId', (req: Request, res: Response) => {
    const { teamId } = req.params;

    teamService.getTeamById(Number(teamId))
        .then((data: Team | undefined) => res.json(data))
        .catch((err) => res.status(404).send(err));
});


//get list of players for a team
teamRouter.get('/:teamId/roster', (req: Request, res: Response) => {
    const { teamId } = req.params;
    console.log(teamId)

    playerService.getPlayersByTeam(Number(teamId))
        .then((data: Array<Player>) => res.json(data))
        .catch((err) => res.status(404).send(err));
})

//create team (teamId, teamName)
teamRouter.post('/', (req: Request, res: Response) => {
    const newTeam = req.body;

    teamService.createTeam(newTeam)
        .then((data: Team) => res.status(201).json(data))
        .catch((err) => res.status(500).send(err));
})

//update team
teamRouter.put('/:teamId', (req: Request, res: Response) => {
    const updatedTeam = req.body;
    const { teamId } = req.params;
    teamService.updateTeam(updatedTeam, Number(teamId))
        .then((data: Team) => res.json(data))
        .catch((err) => res.status(404).send(err));
});

//delete team
teamRouter.delete('/:teamId', (req: Request, res: Response) => {
    const { teamId } = req.params;
    teamService.removeTeam(Number(teamId))
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default teamRouter;