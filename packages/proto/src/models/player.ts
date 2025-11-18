export interface Player {
    playerId: number;
    playerName: string;
    playerNumber: number;
    teamId: number; // foreign key
}