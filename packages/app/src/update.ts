// app/src/update.ts
import { Auth, ThenUpdate } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Game, Player, Stat, Team, User } from "server/models";

export default function update(message: Msg, model: Model, authUser: Auth.User): Model | ThenUpdate<Model, Msg> {
    console.log("authUser in update:", authUser);
    switch (message[0]) {
        case "user/request": {
            const [, payload] = message;
            const { email } = payload;         
            if (model.user?.email === email ) return model;
            return [
                { ...model, user: {email: email} as User},
                requestUser(payload, authUser)
                .then((user) => ["user/load", { user }])
            ];
        }
        case "user/load": {
            const [, payload] = message;
            const { user } = payload;
            return { ...model, user };
        }
        case "user/teams/request": {
            const [, payload] = message;
            return [
                model,
                requestUserTeams(payload, authUser)
                .then((userTeams) => ["user/teams/load", { userTeams }])
            ];
        }
        case "user/teams/load": {
            const [, payload] = message;
            const { userTeams } = payload;
            return { ...model, userTeams };
        }
        case "team/request": {
            const [, payload] = message;
            const { teamId } = payload;         
            if (model.team?.teamId === teamId ) return model;
            return [
                { ...model, team: {teamId: teamId} as Team},
                requestTeam(payload, authUser)
                .then((team) => ["team/load", { team }])
            ];
        }
        case "team/load": {
            const [, payload] = message;
            const { team } = payload;
            return { ...model, team };
        }
        case "team/roster/request": {
            const [, payload] = message;
            return [
                model,
                requestRoster(payload, authUser)
                .then((roster) => ["team/roster/load", { roster }])
            ];
        }
        case "team/roster/load": {
            const [, payload] = message;
            const { roster } = payload;
            return { ...model, roster };
        }
        case "team/schedule/request": {
            const [, payload] = message;
            return [
                model,
                requestSchedule(payload, authUser)
                .then((schedule) => ["team/schedule/load", { schedule }])
            ];
        }
        case "team/schedule/load": {
            const [, payload] = message;
            const { schedule } = payload;
            return { ...model, schedule };
        }
        case "team/stats/request": {
            const [, payload] = message;
            return [
                model,
                requestTeamStats(payload, authUser)
                .then((teamStats) => ["team/stats/load", { teamStats }])
            ];
        }
        case "team/stats/load": {
            const [, payload] = message;
            const { teamStats } = payload;
            return { ...model, teamStats };
        }
        case "game/stats/request": {
            const [, payload] = message;
            return [
                model,
                requestGameStats(payload, authUser)
                .then((gameStats) => ["game/stats/load", { gameStats }])
            ];
        }
        case "game/stats/load": {
            const [, payload] = message;
            const { gameStats } = payload;
            return { ...model, gameStats };
        }
        case "game/request": {
            const [, payload] = message;
            return [
                model,
                requestGame(payload, authUser)
                .then((game) => ["game/load", { game }])
            ];
        }
        case "game/load": {
            const [, payload] = message;
            const { game } = payload;
            return { ...model, game };
        }
        case "player/request": {
            const [, payload] = message;
            return [
                model,
                requestPlayer(payload, authUser)
                .then((player) => ["player/load", { player }])
            ];
        }
        case "player/load": {
            const [, payload] = message;
            const { player } = payload;
            return { ...model, player };
        }
        case "player/stats/request": {
            const [, payload] = message;
            return [
                model,
                requestPlayerStats(payload, authUser)
                .then((playerStats) => ["player/stats/load", { playerStats }])
            ];
        }
        case "player/stats/load": {
            const [, payload] = message;
            const { playerStats } = payload;
            return { ...model, playerStats };
        }
        default:
            throw new Error(`Unhandled Auth message"`);
    }
}

function requestUser(
  payload: { email: string },
  authUser: Auth.User
) {
  return fetch(`/api/users/email/${payload.email}`, {
    headers: Auth.headers(authUser)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error("No Response from server");
    })
    .then((json: unknown) => {
      if (json) return json as User
      throw new Error("No JSON in response from server");
    });
}

function requestUserTeams(
  payload: { email: string },
  authUser: Auth.User
) {
  return fetch(`/api/teams?email=${payload.email}`, {
    headers: Auth.headers(authUser)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error("No Response from server");
    })
    .then((json: unknown) => {
      if (json) return json as Array<Team>
      throw new Error("No JSON in response from server");
    });
}

function requestTeam(
  payload: { teamId: number },
  authUser: Auth.User
) {
  return fetch(`/api/teams/${payload.teamId}`, {
    headers: Auth.headers(authUser)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error("No Response from server");
    })
    .then((json: unknown) => {
      if (json) return json as Team
      throw new Error("No JSON in response from server");
    });
}

function requestRoster(
  payload: { teamId: number },
  authUser: Auth.User
) {
  return fetch(`/api/teams/${payload.teamId}/roster`, {
    headers: Auth.headers(authUser)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error("No Response from server");
    })
    .then((json: unknown) => {
      if (json) return json as Array<Player>
      throw new Error("No JSON in response from server");
    });
}

function requestSchedule(
  payload: { teamId: number },
  authUser: Auth.User
) {
  return fetch(`/api/teams/${payload.teamId}/schedule`, {
    headers: Auth.headers(authUser)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error("No Response from server");
    })
    .then((json: unknown) => {
      if (json) return json as Array<Game>
      throw new Error("No JSON in response from server");
    });
}

function requestTeamStats(
  payload: { teamId: number },
  authUser: Auth.User
) {
  return fetch(`/api/teams/${payload.teamId}/stats`, {
    headers: Auth.headers(authUser)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error("No Response from server");
    })
    .then((json: unknown) => {
      if (json) return json as Array<Stat>
      throw new Error("No JSON in response from server");
    });
}

function requestGameStats(
  payload: { gameId: number },
  authUser: Auth.User
) {
  return fetch(`/api/games/${payload.gameId}/stats`, {
    headers: Auth.headers(authUser)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error("No Response from server");
    })
    .then((json: unknown) => {
      if (json) return json as Array<Stat>
      throw new Error("No JSON in response from server");
    });
}

function requestPlayerStats(
  payload: { playerId: number },
  authUser: Auth.User
) {
  return fetch(`/api/players/${payload.playerId}/stats`, {
    headers: Auth.headers(authUser)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error("No Response from server");
    })
    .then((json: unknown) => {
      if (json) return json as Array<Stat>
      throw new Error("No JSON in response from server");
    });
}

function requestGame(
  payload: { gameId: number },
  authUser: Auth.User
) {
  return fetch(`/api/games/${payload.gameId}`, {
    headers: Auth.headers(authUser)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error("No Response from server");
    })
    .then((json: unknown) => {
      if (json) return json as Game
      throw new Error("No JSON in response from server");
    });
}

function requestPlayer(
  payload: { playerId: number },
  authUser: Auth.User
) {
  return fetch(`/api/players/${payload.playerId}`, {
    headers: Auth.headers(authUser)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error("No Response from server");
    })
    .then((json: unknown) => {
      if (json) return json as Player
      throw new Error("No JSON in response from server");
    });
}