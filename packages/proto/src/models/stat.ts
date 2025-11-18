export interface Stat {
    statId: number;
    statType: string; //[score, assist, block, drop, incompletion]
    playerId: number; //foreign key
    gameId: number; //foreign key
}