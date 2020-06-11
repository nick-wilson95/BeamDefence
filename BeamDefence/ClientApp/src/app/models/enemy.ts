export interface IEnemy{
    id: number;
    position: {x: number, y: number};
    speed: number;
    radius: number;
    score: number;
    type: EnemyType;
    damage: number;
}

export enum EnemyType{
    RegularEnemy,
    BigEnemy,
    LittleEnemy,
    HugeEnemy
}