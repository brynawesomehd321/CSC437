// src/services/team-svc.ts
import { Team } from "../models/team";
import { dbPromise } from "./sqlite3";

class TeamService {

    //index
    async index(userId: number): Promise<Array<Team>> {
        const db = await dbPromise;
        const sql = `SELECT * FROM teams WHERE userId = ?`;
        const teams = await db.all(sql, [userId]);
        return teams as Array<Team>;
    }

    //get
    async getTeamById(teamId: number): Promise<Team> {
        const db = await dbPromise;
        const sql = `SELECT * FROM teams WHERE teamId = ?`;
        const row = await db.get(sql, [teamId]);
        return row as Team;
    }

    //create
    async createTeam(team: Team): Promise<Team> {
        const db = await dbPromise;
        const { teamName, userId } = team;
        const sql = `INSERT INTO teams (teamName, userId) VALUES (?, ?)`;
        const result = await db.run(sql, [teamName, userId]);
        if(result.lastID) {
            const createdTeam = await this.getTeamById(result.lastID);
            return createdTeam;
        }
        else {
            throw new Error("Failed to create new team.")
        }
    }

    //put
    async updateTeam(updatedTeam: Team, teamId: number): Promise<Team> {
        const { teamName, userId } = updatedTeam;
        const db = await dbPromise;
        const sql = `UPDATE teams SET teamName = ?, userId = ? WHERE teamId = ?`;
        const result = await db.run(sql, [teamName, userId, teamId]);
        if(result.changes) {
            return updatedTeam;
        }
        else {
            throw new Error("Team not found or update failed.")
        }
    }

    //delete
    async removeTeam(teamId: number): Promise<void> {
        const db = await dbPromise;
        const sql = 'DELETE FROM teams WHERE teamId = ?'
        const result = await db.run(sql, [teamId]);
        if(result.changes === 0) {
            throw new Error("Team not found or deletion failed");
        }
    }
}

export default TeamService;