// src/services/credential-svc.ts
import bcrypt from "bcryptjs";
import { Credential } from "../models/credential";
import { dbPromise } from "./sqlite3";

class CredentialService {

    //create
    async createCredential(email: string, password: string): Promise<Credential> {
        const db = await dbPromise;
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Insert into DB
        const sql = `INSERT INTO credentials (email, hashedPassword) VALUES (?, ?)`;
        await db.run(sql, [email, hashedPassword]);

        // Retrieve the created credential by email (TEXT PK)
        const createdCredential = await db.get(
            "SELECT * FROM credentials WHERE email = ?",
            [email]
        );

        if (!createdCredential) {
            throw new Error("Failed to retrieve the created credential.");
        }

        return createdCredential;
    }

    //verify
    async verify(email: string, password: string): Promise<string> {
        const db = await dbPromise;
        return await db.get("SELECT * FROM credentials WHERE email = ?", [email])
            .then((credsOnFile: Credential) =>
                bcrypt.compare(password, credsOnFile.hashedPassword)
                .then((result: boolean) => {
                    if (!result) throw new Error("Invalid username or password");
                    return credsOnFile.email;
                }));
    }

}

export default CredentialService;