// src/services/user-svc.ts
import { Database } from "sqlite";
import { User } from "../models/user";

class UserService {
    constructor(private db: Database) {}

    //get
    async getUserById(id: string): Promise<User | undefined> {
        const sql = `SELECT * FROM users WHERE userid = ?`;
        const row = await this.db.get(sql, [id]);
        return row as User | undefined;
    }

    //create
    /*async createUser(user: User): Promise<User> {
        const { userid, username, email } = user;
        const sql = `INSERT INTO users (userid, username, email) VALUES (${userid}, ${username}, ${email})'`;

        const result = await this.db.run(sql);
        const createdUser = this.getUserById(userid);
        if (createdUser) {
            return createdUser;
        } else {
            throw new Error('Failed to create user');
        }
    }*/

}

export default UserService;