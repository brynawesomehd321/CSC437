import sqlite3 from "sqlite3";
import { open } from "sqlite"


export async function openDatabase() {
    //Open database
    const db = await open({
        filename: '../database.db', // Specify the database file
        driver: sqlite3.Database,
    });

    // Define the SQL statement to create a table
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS users (
            userid INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )`;

    // Execute the SQL statement to create the table
    await db.run(createTableSql, (err: { message: string; }) => {
        if (err) {
            return console.error('Error creating table:', err.message);
        }
        console.log('Table created successfully');
    });
    return db;
}

