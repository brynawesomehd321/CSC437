// src/services/game-svc.ts
import { Game } from "../models/game";
import { dbPromise } from "./sqlite3";
import TeamService from "./team-svc";

const teamService = new TeamService();

class GameService {

    //index
    async index(): Promise<Array<Game>> {
        const db = await dbPromise;
        const sql = `SELECT * FROM games`;
        const games = await db.all(sql);
        return games as Array<Game>;
    }

    //get
    async getGameById(gameId: number): Promise<Game> {
        const db = await dbPromise;
        const sql = `SELECT * FROM games WHERE gameId = ?`;
        const row = await db.get(sql, [gameId]);
        return row as Game;
    }

    //create
    async createGame(game: Game): Promise<Game> {
        const db = await dbPromise;
        const { location, date, teamId } = game;
        //Check if team exists
        const team = await teamService.getTeamById(teamId);
        if (!team) throw new Error("Team does not exist");

        const sql = `INSERT INTO games (location, date, teamId) VALUES (?, ?, ?)`;
        const result = await db.run(sql, [location, date, Number(teamId)]);
        if(result.lastID) {
            const createdGame = await this.getGameById(result.lastID);
            return createdGame;
        }
        else {
            throw new Error("Failed to create new game.")
        }
    }

    //put
    async updateGame(updatedGame: Game, gameId: number): Promise<Game> {
        const { location, date, teamId } = updatedGame;
        const db = await dbPromise;
        const sql = `UPDATE games SET location = ?, date = ?, teamId = ? WHERE gameId = ?`;
        const result = await db.run(sql, [location, date, teamId, gameId]);
        if(result.changes) {
            return updatedGame;
        }
        else {
            throw new Error("Game not found or update failed.")
        }
    }

    //delete
    async removeGame(gameId: number): Promise<void> {
        const db = await dbPromise;
        const sql = 'DELETE FROM games WHERE gameId = ?'
        const result = await db.run(sql, [gameId]);
        if(result.changes === 0) {
            throw new Error("Game not found or deletion failed");
        }
    }
}

export default GameService;