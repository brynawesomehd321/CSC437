// src/services/team-svc.ts
import { Player } from "../models/player";
import { dbPromise } from "./sqlite3";
import TeamService from "./team-svc";

const teamService = new TeamService;

class PlayerService {

    //index
    async index(): Promise<Array<Player>> {
        const db = await dbPromise;
        const sql = `SELECT * FROM players`;
        const players = await db.all(sql);
        return players as Array<Player>;
    }

    //index a list of players on a team
    async getPlayersByTeam(teamId: number): Promise<Array<Player>> {
        const db = await dbPromise;
        const sql = `SELECT * FROM players WHERE teamId = ?`;
        const players = await db.all(sql, [teamId]);
        return players as Array<Player>;
    }

    //get
    async getPlayerById(playerId: number): Promise<Player> {
        const db = await dbPromise;
        const sql = `SELECT * FROM players WHERE playerId = ?`;
        const row = await db.get(sql, [playerId]);
        return row as Player;
    }

    //create
    async createPlayer(player: Player): Promise<Player> {
        const db = await dbPromise;
        const { playerName, playerNumber, teamId } = player;
        //Check if team exists
        const team = await teamService.getTeamById(teamId);
        if (!team) throw new Error("Team does not exist");

        const sql = `INSERT INTO players (playerName, playerNumber, teamId) VALUES (?, ?, ?)`;
        const result = await db.run(sql, [playerName, playerNumber, Number(teamId)]);
        if(result.lastID) {
            const createdPlayer = await this.getPlayerById(result.lastID);
            return createdPlayer;
        }
        else {
            throw new Error("Failed to create new player.")
        }
    }

    //put
    async updatePlayer(updatedPlayer: Player, playerId: number): Promise<Player> {
        const { playerName, playerNumber, teamId } = updatedPlayer;
        const db = await dbPromise;
        const sql = `UPDATE players SET playerName = ?, playerNumber = ?, teamId = ? WHERE playerId = ?`;
        const result = await db.run(sql, [playerName, playerNumber, teamId, playerId]);
        if(result.changes) {
            return updatedPlayer;
        }
        else {
            throw new Error("Player not found or update failed.")
        }
    }

    //delete
    async removePlayer(playerId: number): Promise<void> {
        const db = await dbPromise;
        const sql = 'DELETE FROM players WHERE playerId = ?'
        const result = await db.run(sql, [playerId]);
        if(result.changes === 0) {
            throw new Error("Player not found or deletion failed");
        }
    }
}

export default PlayerService;