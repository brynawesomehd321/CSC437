// app/src/model.ts
import { Player, Team, Game, User, Stat } from "server/models";

export interface Model {
    user?: User;
    userTeams?: Array<Team>;
    team?: Team;
    roster?: Array<Player>;
    player?: Player;
    schedule?: Array<Game>;
    game?: Game;
    teamStats?: Array<Stat>;
    gameStats?: Array<Stat>;
    playerStats?: Array<Stat>;
}

export const init: Model = {};