// src/services/stat-svc.ts
import { Stat } from "../models/stat";
import { dbPromise } from "./sqlite3";
import PlayerService from "./player-svc";
import GameService from "./game-svc";

const playerService = new PlayerService();
const gameService = new GameService();

class StatService {

    //index
    async index(): Promise<Array<Stat>> {
        const db = await dbPromise;
        const sql = `SELECT * FROM stats`;
        const stats = await db.all(sql);
        return stats as Array<Stat>;
    }

    //get stat by player Id
    async getStatByPlayerId(playerId: number): Promise<Array<Stat>> {
        const db = await dbPromise;
        const sql = `SELECT * FROM stats WHERE playerId = ?`;
        const row = await db.all(sql, [playerId]);
        return row as Array<Stat>;
    }

    //get all individual stats for a team
    async getStatByTeamId(teamId: number): Promise<Array<Stat>> {
        const db = await dbPromise;
        const sql = `
            SELECT s.*
            FROM stats s
            JOIN players p ON s.playerId = p.playerId
            WHERE p.teamId = ?
        ;`;
        const row = await db.all(sql, [teamId]);
        return row as Array<Stat>;
    }

    //get all stats for a game
    async getStatsByGameId(gameId: number): Promise<Array<Stat>> {
        const db = await dbPromise;
        const sql = `
            SELECT *
            FROM stats
            WHERE gameId = ?
        ;`;
        const row = await db.all(sql, [gameId]);
        return row as Array<Stat>;
    }

    //get a total count of all stats for a TEAM
    /*Returns an object like this:
        {
        "totalScores": 15,
        "totalBlocks": 7,
        "totalDrops": 3,
        "totalIncompletions": 2
        }
    */
    async getAllTeamStats(teamId: number) {
        const db = await dbPromise;
        const sql = `
            SELECT 
                SUM(CASE WHEN s.statType = 'score' THEN 1 ELSE 0 END) AS totalScores,
                SUM(CASE WHEN s.statType = 'block' THEN 1 ELSE 0 END) AS totalBlocks,
                SUM(CASE WHEN s.statType = 'drop' THEN 1 ELSE 0 END) AS totalDrops,
                SUM(CASE WHEN s.statType = 'incompletion' THEN 1 ELSE 0 END) AS totalIncompletions
            FROM stats s
            JOIN players p ON s.playerId = p.playerId
            WHERE p.teamId = ?;
        `;
        const result = await db.get(sql, [teamId]);
        return result;
    }

    //get a total count of all stats for a PLAYER
    /*Returns an object like this:
        {
        "totalScores": 15,
        "totalBlocks": 7,
        "totalDrops": 3,
        "totalIncompletions": 2
        }
    */
    async getAllPlayerStats(playerId: number) {
        const db = await dbPromise;
        const sql = `
            SELECT 
                SUM(CASE WHEN statType = 'score' THEN 1 ELSE 0 END) AS totalScores,
                SUM(CASE WHEN statType = 'block' THEN 1 ELSE 0 END) AS totalBlocks,
                SUM(CASE WHEN statType = 'drop' THEN 1 ELSE 0 END) AS totalDrops,
                SUM(CASE WHEN statType = 'incompletion' THEN 1 ELSE 0 END) AS totalIncompletions
            FROM stats
            WHERE playerId = ?;
        `;
        const result = await db.get(sql, [playerId]);
        return result;
    }

    //get
    async getStatById(statId: number): Promise<Stat> {
        const db = await dbPromise;
        const sql = `SELECT * FROM stats WHERE statId = ?`;
        const row = await db.get(sql, [statId]);
        return row as Stat;
    }

    //create
    async createStat(stat: Stat): Promise<Stat> {
        const db = await dbPromise;
        const { statType, playerId, gameId } = stat;
        //Check if game and player exist
        const player = await playerService.getPlayerById(playerId);
        if (!player) throw new Error("Player does not exist");
        const game = await gameService.getGameById(gameId);
        if (!game) throw new Error("Game does not exist");

        const sql = `INSERT INTO stats (statType, playerId, gameId) VALUES (?, ?, ?)`;
        const result = await db.run(sql, [statType, Number(playerId), Number(gameId)]);
        if(result.lastID) {
            const createdStat = await this.getStatById(result.lastID);
            return createdStat;
        }
        else {
            throw new Error("Failed to create new stat.")
        }
    }

    //put
    async updateStat(updatedStat: Stat, statId: number): Promise<Stat> {
        const { statType, playerId, gameId } = updatedStat;
        const db = await dbPromise;
        const sql = `UPDATE stats SET statType = ?, playerId = ?, gameId = ? WHERE statId = ?`;
        const result = await db.run(sql, [statType, playerId, gameId, statId]);
        if(result.changes) {
            return updatedStat;
        }
        else {
            throw new Error("Stat not found or update failed.")
        }
    }

    //delete
    async removeStat(statId: number): Promise<void> {
        const db = await dbPromise;
        const sql = 'DELETE FROM stats WHERE statId = ?'
        const result = await db.run(sql, [statId]);
        if(result.changes === 0) {
            throw new Error("Stat not found or deletion failed");
        }
    }
}

export default StatService;