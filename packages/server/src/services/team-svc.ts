// src/services/team-svc.ts
import { Team } from "../models/team";
import { dbPromise } from "./sqlite3";

class TeamService {

    //index
    async index(email: string): Promise<Array<Team>> {
        const db = await dbPromise;
        const sql = `SELECT * FROM teams WHERE email = ?`;
        const teams = await db.all(sql, [email]);
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
        const { teamName, email } = team;
        const sql = `INSERT INTO teams (teamName, email) VALUES (?, ?)`;
        const result = await db.run(sql, [teamName, email]);
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
        const { teamName, email } = updatedTeam;
        const db = await dbPromise;
        const sql = `UPDATE teams SET teamName = ?, email = ? WHERE teamId = ?`;
        const result = await db.run(sql, [teamName, email, teamId]);
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