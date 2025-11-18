// src/models/user.ts

export interface User {
  userid: number;
  fullName: string;
  email: string; //foreign key to credential
}