// app/src/update.ts
import { Auth, Message, ThenUpdate } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Game, Player, Stat, Team, User } from "server/models";

export default function update(message: Msg, model: Model, authUser: Auth.User): Model | ThenUpdate<Model, Msg> {
  const [command, payload, callbacks] = message;
  switch (command) {
    case "user/request": {
      const { email } = payload;
      if (model.user?.email === email) return model;
      return [
        { ...model, user: { email: email } as User },
        requestUser(payload, authUser)
          .then((user) => ["user/load", { user }])
      ];
    }
    case "user/load": {
      const { user } = payload;
      return { ...model, user };
    }
    case "user/save": {
      return [
        model,
        saveUser(payload, authUser, callbacks)
          .then((user) => ["user/load", { user }])
      ];
    }
    case "user/teams/request": {
      return [
        model,
        requestUserTeams(payload, authUser)
          .then((userTeams) => ["user/teams/load", { userTeams }])
      ];
    }
    case "team/save": {
      return [
        model,
        saveTeam(payload, authUser, callbacks)
          .then((team) => ["user/teams/load", { userTeams: [...(model.userTeams ?? []), team] }])
      ];
    }
    case "game/save": {
      return [
        model,
        saveGame(payload, authUser, callbacks)
          .then((game) => ["team/schedule/load", { schedule: [...(model.schedule ?? []), game] }])
      ];
    }
    case "stat/save": {
      return [
        model,
        saveStat(payload, authUser, callbacks).then((stat) => {
          const playerStats = [...(model.playerStats ?? []), stat];
          const gameStats = [...(model.gameStats ?? []), stat];
          const teamStats = [...(model.teamStats ?? []), stat];

          return [
            "stats/load",
            { playerStats, gameStats, teamStats }
          ] as Msg;
        })
      ];
    }
    case "stats/load": {
      const { playerStats, gameStats, teamStats } = payload;
      return {
        ...model,
        playerStats,
        gameStats,
        teamStats
      };
    }
    case "user/teams/load": {
      const { userTeams } = payload;
      return { ...model, userTeams };
    }
    case "team/request": {
      const { teamId } = payload;
      if (model.team?.teamId === teamId) return model;
      return [
        { ...model, team: { teamId: teamId } as Team },
        requestTeam(payload, authUser)
          .then((team) => ["team/load", { team }])
      ];
    }
    case "team/load": {
      const { team } = payload;
      return { ...model, team };
    }
    case "team/delete": {
      return [
        model,
        deleteTeam(payload, authUser, callbacks)
          .then()
      ];
    }
    case "stat/delete": {
      return [
        model,
        deleteStat(payload, authUser, callbacks)
          .then()
      ];
    }
    case "game/delete": {
      return [
        model,
        deleteGame(payload, authUser, callbacks)
          .then()
      ];
    }
    case "player/delete": {
      return [
        model,
        deletePlayer(payload, authUser, callbacks)
          .then()
      ];
    }
    case "team/roster/request": {
      return [
        model,
        requestRoster(payload, authUser)
          .then((roster) => ["team/roster/load", { roster }])
      ];
    }
    case "team/roster/load": {
      const { roster } = payload;
      return { ...model, roster };
    }
    case "team/schedule/request": {
      return [
        model,
        requestSchedule(payload, authUser)
          .then((schedule) => ["team/schedule/load", { schedule }])
      ];
    }
    case "team/schedule/load": {
      const { schedule } = payload;
      return { ...model, schedule };
    }
    case "team/stats/request": {
      return [
        model,
        requestTeamStats(payload, authUser)
          .then((teamStats) => ["team/stats/load", { teamStats }])
      ];
    }
    case "team/stats/load": {
      const { teamStats } = payload;
      return { ...model, teamStats };
    }
    case "game/stats/request": {
      return [
        model,
        requestGameStats(payload, authUser)
          .then((gameStats) => ["game/stats/load", { gameStats }])
      ];
    }
    case "game/stats/load": {
      const { gameStats } = payload;
      return { ...model, gameStats };
    }
    case "game/request": {
      return [
        model,
        requestGame(payload, authUser)
          .then((game) => ["game/load", { game }])
      ];
    }
    case "game/load": {
      const { game } = payload;
      return { ...model, game };
    }
    case "player/request": {
      return [
        model,
        requestPlayer(payload, authUser)
          .then((player) => ["player/load", { player }])
      ];
    }
    case "player/save": {
      return [
        model,
        savePlayer(payload, authUser, callbacks)
          .then((player) => [
            "team/roster/load",
            { roster: [...(model.roster ?? []), player] }
          ])
      ];
    }
    case "player/load": {
      const { player } = payload;
      return { ...model, player };
    }
    case "player/stats/request": {
      return [
        model,
        requestPlayerStats(payload, authUser)
          .then((playerStats) => ["player/stats/load", { playerStats }])
      ];
    }
    case "player/stats/load": {
      const { playerStats } = payload;
      return { ...model, playerStats };
    }
    default:
      const unhandled: never = command; // <-- never type
      throw new Error(`Unhandled message "${unhandled}"`);
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

function saveUser(
  msg: {
    userid: number;
    user: User;
  },
  authUser: Auth.User,
  callbacks: Message.Reactions
): Promise<User> {
  return fetch(`/api/users/${msg.userid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(authUser)
    },
    body: JSON.stringify(msg.user)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error(
        `Failed to save profile for ${msg.userid}`
      );
    })
    .then((json: unknown) => {
      if (json) {
        if (callbacks.onSuccess) callbacks.onSuccess();
        return json as User;
      }
      throw new Error(
        `No JSON in API response`
      )
    })
    .catch((err) => {
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}

function saveTeam(
  msg: {
    team: Team;
  },
  authUser: Auth.User,
  callbacks: Message.Reactions
): Promise<Team> {
  return fetch(`/api/teams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(authUser)
    },
    body: JSON.stringify(msg.team)
  })
    .then((response: Response) => {
      if (response.status === 201) return response.json();
      throw new Error(
        `Failed to save team for ${JSON.stringify(msg.team)}`
      );
    })
    .then((json: unknown) => {
      if (json) {
        if (callbacks.onSuccess) callbacks.onSuccess();
        return json as Team;
      }
      throw new Error(
        `No JSON in API response`
      )
    })
    .catch((err) => {
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}

function saveGame(
  msg: {
    game: Game;
  },
  authUser: Auth.User,
  callbacks: Message.Reactions
): Promise<Game> {
  return fetch(`/api/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(authUser)
    },
    body: JSON.stringify(msg.game)
  })
    .then((response: Response) => {
      if (response.status === 201) return response.json();
      throw new Error(
        `Failed to save team for ${JSON.stringify(msg.game)}`
      );
    })
    .then((json: unknown) => {
      if (json) {
        if (callbacks.onSuccess) callbacks.onSuccess();
        return json as Game;
      }
      throw new Error(
        `No JSON in API response`
      )
    })
    .catch((err) => {
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}

function saveStat(
  msg: {
    stat: Stat;
  },
  authUser: Auth.User,
  callbacks: Message.Reactions
): Promise<Stat> {
  return fetch(`/api/stats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(authUser)
    },
    body: JSON.stringify(msg.stat)
  })
    .then((response: Response) => {
      if (response.status === 201) return response.json();
      throw new Error(
        `Failed to save stat for ${JSON.stringify(msg.stat)}`
      );
    })
    .then((json: unknown) => {
      if (json) {
        if (callbacks.onSuccess) callbacks.onSuccess();
        return json as Stat;
      }
      throw new Error(
        `No JSON in API response`
      )
    })
    .catch((err) => {
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}

function savePlayer(
  msg: {
    player: Player;
  },
  authUser: Auth.User,
  callbacks: Message.Reactions
): Promise<Player> {
  return fetch(`/api/players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(authUser)
    },
    body: JSON.stringify(msg.player)
  })
    .then((response: Response) => {
      if (response.status === 201) return response.json();
      throw new Error(
        `Failed to save stat for ${JSON.stringify(msg.player)}`
      );
    })
    .then((json: unknown) => {
      if (json) {
        if (callbacks.onSuccess) callbacks.onSuccess();
        return json as Player;
      }
      throw new Error(
        `No JSON in API response`
      )
    })
    .catch((err) => {
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}

function deleteTeam(
  msg: {
    teamId: number;
  },
  authUser: Auth.User,
  callbacks: Message.Reactions
): Promise<void> {
  return fetch(`/api/teams/${msg.teamId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(authUser)
    },
  })
    .then((response: Response) => {
      if (response.ok) {
        // call success callback
        if (callbacks.onSuccess) callbacks.onSuccess();
        return;
      }
      throw new Error(`Failed to delete team`);
    })
    .catch((err) => {
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}

function deleteStat(
  msg: {
    statId: number;
  },
  authUser: Auth.User,
  callbacks: Message.Reactions
): Promise<void> {
  return fetch(`/api/stats/${msg.statId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(authUser)
    },
  })
    .then((response: Response) => {
      if (response.ok) {
        // call success callback
        if (callbacks.onSuccess) callbacks.onSuccess();
        return;
      }
      throw new Error(`Failed to delete stat`);
    })
    .catch((err) => {
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}

function deleteGame(
  msg: {
    gameId: number;
  },
  authUser: Auth.User,
  callbacks: Message.Reactions
): Promise<void> {
  return fetch(`/api/games/${msg.gameId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(authUser)
    },
  })
    .then((response: Response) => {
      if (response.ok) {
        // call success callback
        if (callbacks.onSuccess) callbacks.onSuccess();
        return;
      }
      throw new Error(`Failed to delete game`);
    })
    .catch((err) => {
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}

function deletePlayer(
  msg: {
    playerId: number;
  },
  authUser: Auth.User,
  callbacks: Message.Reactions
): Promise<void> {
  return fetch(`/api/players/${msg.playerId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(authUser)
    },
  })
    .then((response: Response) => {
      if (response.ok) {
        // call success callback
        if (callbacks.onSuccess) callbacks.onSuccess();
        return;
      }
      throw new Error(`Failed to delete player`);
    })
    .catch((err) => {
      if (callbacks.onFailure) callbacks.onFailure(err);
      throw err;
    });
}