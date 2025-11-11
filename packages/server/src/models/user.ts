// src/models/user.ts

import { Team } from "./team";

export interface User {
  userid: number;
  fullName: string;
  email: string; //foreign key to credential
}