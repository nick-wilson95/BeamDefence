import { IEnemy, EnemyType } from "../models/enemy";
import { Vectors } from "../utils/vectors";

export class EnemyDrawer{
    sketch: any;
    enemy: IEnemy;

    constructor(sketch: any, enemy: IEnemy){
        this.sketch = sketch;
        this.enemy = enemy;
    }

    draw(): boolean {
        var distanceToCentre = Vectors.distance(this.sketch.width/2, this.sketch.height/2, this.enemy.position.x, this.enemy.position.y);
    
        if (distanceToCentre < this.enemy.speed) return true;
        
        this.enemy.position.x = this.enemy.position.x + this.enemy.speed * (this.sketch.width/2 - this.enemy.position.x) / distanceToCentre;
        this.enemy.position.y = this.enemy.position.y + this.enemy.speed * (this.sketch.height/2 - this.enemy.position.y) / distanceToCentre;
    
        var colour;
        switch (this.enemy.type) {
            case EnemyType.RegularEnemy:
                colour = this.sketch.color(180, 0, 0);
                break;
            case EnemyType.BigEnemy:
                colour = this.sketch.color(0, 180, 0);
                break;
            case EnemyType.LittleEnemy:
                colour = this.sketch.color(0, 0, 180);
                break;
            case EnemyType.HugeEnemy:
                colour = this.sketch.color(120, 120, 0);
                break;
        }

        this.sketch.fill(colour);
        this.sketch.noStroke();
        this.sketch.circle(this.enemy.position.x, this.enemy.position.y, this.enemy.radius * 2);

        return false;
    }

    drawDead(): void {    
        var colour = this.sketch.color(100, 100, 100);

        this.sketch.fill(colour);
        this.sketch.noStroke();
        this.sketch.circle(this.enemy.position.x, this.enemy.position.y, this.enemy.radius * 2);
    }
}