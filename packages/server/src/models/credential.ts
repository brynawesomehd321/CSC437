// src/models/credential.ts
export interface Credential {
  email: string; //primary key
  hashedPassword: string;
}