// src/services/user-svc.ts
import { Database } from "sqlite";
import { User } from "../models/user";
import { dbPromise } from "./sqlite3";

class UserService {

    //index
    async index(): Promise<Array<User>> {
        const db = await dbPromise;
        const sql = `SELECT * FROM users`;
        const users = await db.all(sql);
        return users as Array<User>;
    }

    //get
    async getUserById(userid: number): Promise<User> {
        const db = await dbPromise;
        const sql = `SELECT * FROM users WHERE userid = ?`;
        const row = await db.get(sql, [userid]);
        return row as User;
    }

    //create
    async createUser(user: User): Promise<User> {
        const db = await dbPromise;
        const { username, email } = user;
        const sql = `INSERT INTO users (username, email) VALUES (?, ?)`;
        const result = await db.run(sql, [username, email]);
        if(result.lastID) {
            const createdUser = await this.getUserById(result.lastID);
            return createdUser;
        }
        else {
            throw new Error("Failed to create new user.")
        }
    }

    //put
    async updateUser(updatedUser: User, userid: number): Promise<User> {
        const { username, email } = updatedUser;
        const db = await dbPromise;
        const sql = `UPDATE users SET username = ?, email = ? WHERE userid = ?`;
        const result = await db.run(sql, [username, email, userid]);
        if(result.changes) {
            return updatedUser;
        }
        else {
            throw new Error("User not found or update failed.")
        }
    }

    //delete
    async removeUser(userid: number): Promise<void> {
        const db = await dbPromise;
        const sql = 'DELETE FROM users WHERE userid = ?'
        const result = await db.run(sql, [userid]);
        if(result.changes === 0) {
            throw new Error("User not found or deletion failed");
        }
    }
}

export default UserService;