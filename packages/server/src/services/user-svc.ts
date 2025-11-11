// src/services/user-svc.ts
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
    async getUserById(userId: number): Promise<User> {
        const db = await dbPromise;
        const sql = `SELECT * FROM users WHERE userId = ?`;
        const row = await db.get(sql, [userId]);
        return row as User;
    }

    //create
    async createUser(user: User): Promise<User> {
        const db = await dbPromise;
        const { fullName, email } = user;
        const sql = `INSERT INTO users (fullName, email) VALUES (?, ?)`;
        const result = await db.run(sql, [fullName, email]);
        if(result.lastID) {
            const createdUser = await this.getUserById(result.lastID);
            return createdUser;
        }
        else {
            throw new Error("Failed to create new user.")
        }
    }

    //put
    async updateUser(updatedUser: User, userId: number): Promise<User> {
        const { fullName, email } = updatedUser;
        const db = await dbPromise;
        const sql = `UPDATE users SET fullName = ?, email = ? WHERE userId = ?`;
        const result = await db.run(sql, [fullName, email, userId]);
        if(result.changes) {
            return updatedUser;
        }
        else {
            throw new Error("User not found or update failed.")
        }
    }

    //delete
    async removeUser(userId: number): Promise<void> {
        const db = await dbPromise;
        const sql = 'DELETE FROM users WHERE userId = ?'
        const result = await db.run(sql, [userId]);
        if(result.changes === 0) {
            throw new Error("User not found or deletion failed");
        }
    }
}

export default UserService;