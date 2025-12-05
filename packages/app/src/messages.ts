// app/src/messages.ts
import { Game, Player, Team, User, Stat } from "server/models";

export type Msg =
  | ["user/request", { email: string }]
  | ["user/teams/request", { email: string }]
  | [
      "user/save",
      {
        userid: number,
        user: User
      }, {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "team/save", 
      {
        team: Team;
      }, {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "team/delete", 
      {
        teamId: number;
      }, {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "stat/delete", 
      {
        statId: number;
      }, {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "game/delete", 
      {
        gameId: number;
      }, {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "player/delete", 
      {
        playerId: number;
      }, {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "stat/save", 
      {
        stat: Stat;
      }, {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]  
  | [
      "player/save", 
      {
        player: Player;
      }, {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]  
  | [
      "game/save", 
      {
        game: Game;
      }, {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]  
  | ["team/request", { teamId: number }]
  | ["team/roster/request", { teamId: number }]
  | ["team/schedule/request", { teamId: number }]
  | ["team/stats/request", { teamId: number }]
  | ["game/stats/request", { gameId: number }]
  | ["game/request", { gameId: number }]
  | ["player/stats/request", { playerId: number }]
  | ["player/request", { playerId: number }]
  | Cmd
  ;

  type Cmd =
  | ["user/load", { user: User }]
  | ["team/load", { team: Team }]
  | ["team/roster/load", { roster: Array<Player> }]
  | ["user/teams/load", { userTeams: Array<Team> }]
  | ["team/schedule/load", { schedule: Array<Game> }]
  | ["team/stats/load", { teamStats: Array<Stat> }]
  | ["game/stats/load", { gameStats: Array<Stat> }]
  | ["game/load", { game: Game }]
  | ["player/stats/load", { playerStats: Array<Stat> }]
  | ["player/load", { player: Player }]
  | ["stats/load", { playerStats: Array<Stat>, gameStats: Array<Stat>, teamStats: Array<Stat> }]
  ;