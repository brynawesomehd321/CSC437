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