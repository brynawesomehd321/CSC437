// src/models/user.ts

import { Team } from "./team";

export interface User {
  userid: number;
  username: string;
  email: string;
  teams: Array<Team>;
}