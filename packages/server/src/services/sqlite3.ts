import sqlite3 from "sqlite3";
import { open } from "sqlite"

//Open database
export const dbPromise = open({
    filename: '../database.db', // Specify the database file
    driver: sqlite3.Database,
});

export async function openDatabase() {

    const db = await dbPromise;

    //Enforce cascades
    await db.run('PRAGMA foreign_keys = ON;');

    // Define the SQL statement to create a table
    const createCredentialsTableSql = `
        CREATE TABLE IF NOT EXISTS credentials (
            email TEXT PRIMARY KEY,
            hashedPassword TEXT NOT NULL
        );`;

    //Create credentials table
    await db.run(createCredentialsTableSql, (err: { message: string; }) => {
        if (err) {
            return console.error('Error creating credentials table:', err.message);
        }
        console.log('credentials table created successfully');
    });

    const createUsersTableSql = `
        CREATE TABLE IF NOT EXISTS users (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            FOREIGN KEY (email) REFERENCES credentials(email)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`;

    //Create users table
    await db.run(createUsersTableSql, (err: { message: string; }) => {
        if (err) {
            return console.error('Error creating users table:', err.message);
        }
        console.log('users table created successfully');
    });

    const createTeamsTableSql = `
        CREATE TABLE IF NOT EXISTS teams (
            teamId INTEGER PRIMARY KEY AUTOINCREMENT,
            teamName TEXT UNIQUE NOT NULL,
            email INTEGER NOT NULL,
            FOREIGN KEY (email) REFERENCES users(email)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`;

    //Create teams table
    await db.run(createTeamsTableSql, (err: { message: string; }) => {
        if (err) {
            return console.error('Error creating teams table:', err.message);
        }
        console.log('teams table created successfully');
    });

    const createPlayersTableSql = `
        CREATE TABLE IF NOT EXISTS players (
            playerId INTEGER PRIMARY KEY AUTOINCREMENT,
            playerName TEXT UNIQUE NOT NULL,
            playerNumber INTEGER NOT NULL,
            teamId INTEGER NOT NULL,
            FOREIGN KEY (teamId) REFERENCES teams(teamId)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`;

    //Create players table
    await db.run(createPlayersTableSql, (err: { message: string; }) => {
        if (err) {
            return console.error('Error creating players table:', err.message);
        }
        console.log('players table created successfully');
    });

    const createGamesTableSql = `
        CREATE TABLE IF NOT EXISTS games (
            gameId INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            location TEXT NOT NULL,
            date TEXT NOT NULL,
            teamId INTEGER NOT NULL,
            FOREIGN KEY (teamId) REFERENCES teams(teamId)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`;

    //Create games table
    await db.run(createGamesTableSql, (err: { message: string; }) => {
        if (err) {
            return console.error('Error creating games table:', err.message);
        }
        console.log('games table created successfully');
    });

    const createStatsTableSql = `
        CREATE TABLE IF NOT EXISTS stats (
            statId INTEGER PRIMARY KEY AUTOINCREMENT,
            statType TEXT NOT NULL,
            playerId INTEGER NOT NULL,
            gameId INTEGER NOT NULL,
            FOREIGN KEY (playerId) REFERENCES players(playerId)
                ON DELETE CASCADE
                ON UPDATE CASCADE,
            FOREIGN KEY (gameId) REFERENCES games(gameId)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`;

    //Create stats table
    await db.run(createStatsTableSql, (err: { message: string; }) => {
        if (err) {
            return console.error('Error creating stats table:', err.message);
        }
        console.log('stats table created successfully');
    });

    return db;
}

