import { IPlayer } from "../models/player";
import { IEnemy } from "../models/enemy";
import { Sketch } from "../utils/sketch";
import { Vectors } from "../utils/vectors";

export class TowerDrawer{
    static readonly towerDistance = 50;
    static lastPositions: Map<number, {x: number, y: number}> = new Map<number, {x: number, y: number}>();

    sketch: any;
    player: IPlayer;
    towerIndex: number;
    numTowers: number;
    isUs: boolean;
    position: {x: number, y: number};
    colour: any;
    targetX: number;
    targetY: number;

    constructor(sketch: any, player: IPlayer, towerIndex: number, numTowers: number, isUs: boolean) {
        this.sketch = sketch;
        this.player = player;
        this.towerIndex = towerIndex;
        this.numTowers = numTowers;
        this.isUs = isUs;

        this.position = this.getTowerPosition(towerIndex, numTowers);
        this.colour = this.getTowerColour(towerIndex, numTowers);

        if (this.isUs) {
            this.targetX = sketch.mouseX;
            this.targetY = sketch.mouseY;
            return;
        }

        this.targetX = player.mouse.x;
        this.targetY = player.mouse.y;

        if (TowerDrawer.lastPositions.has(player.id)) {
            var lastPosition = TowerDrawer.lastPositions.get(player.id);
            this.targetX = lastPosition.x + (player.mouse.x - lastPosition.x) * 0.2;
            this.targetY = lastPosition.y + (player.mouse.y - lastPosition.y) * 0.2;
        }

        TowerDrawer.lastPositions.set(player.id, {x: this.targetX, y: this.targetY});
    }
    
    draw(enemies: IEnemy[], onEnemyHit: (colour: any, enemy: IEnemy, position: {x: number, y: number}) => void) {
        this.sketch.noStroke();
      
        var towerBaseColour = this.sketch.color(50, 50, 50);
        this.sketch.fill(towerBaseColour);
        this.sketch.circle(this.position.x, this.position.y, 40);
        
        var towerColour = this.sketch.color(100, 100, 100);
        this.sketch.fill(towerColour);
        this.sketch.circle(this.position.x, this.position.y, 30);
      
        this.sketch.stroke(this.colour);  
      
        var strokeWeight = 8
        this.sketch.strokeWeight(strokeWeight);

        Sketch.lineThroughPoint(this.sketch, this.position.x, this.position.y, this.targetX, this.targetY, 18);
        
        this.drawBeam(enemies, onEnemyHit);
    }

    private drawBeam(enemies: IEnemy[], onEnemyHit: (colour: any, enemy: IEnemy, position: {x: number, y: number}) => void) {
        this.colour.setAlpha(150);
        this.sketch.stroke(this.colour);
        this.colour.setAlpha(255);
        
        var strokeWeight = 2 + Math.floor(Math.random() * 2);
        this.sketch.strokeWeight(strokeWeight);

        var xPosition = this.position.x;
        var yPosition = this.position.y;

        Sketch.lineThroughPoint(this.sketch, xPosition, yPosition, this.targetX, this.targetY, this.sketch.width);
        
        enemies.forEach(e => {
          if (Vectors.pointToHalfLineDistance(e.position.x, e.position.y, xPosition, yPosition, this.targetX, this.targetY) < e.radius){
                var enemyDist = Vectors.distance(xPosition, yPosition, e.position.x, e.position.y);
                var mouseDist = Vectors.distance(xPosition, yPosition, this.targetX, this.targetY);

                var hitLocation = {x: xPosition + (this.targetX-xPosition) * enemyDist/mouseDist, y: yPosition + (this.targetY-yPosition) * enemyDist/mouseDist};
                onEnemyHit(this.colour, e, hitLocation);
            }
        });
    }
    
    private getTowerPosition(index: number, numPlayers: number): {x: number, y: number} {
        var proportion = index / numPlayers;
        var xPosition = this.sketch.width/2 + TowerDrawer.towerDistance * Math.sin(proportion * 2 * Math.PI);
        var yPosition = this.sketch.height/2 - TowerDrawer.towerDistance * Math.cos(proportion * 2 * Math.PI);
    
        return {x: xPosition, y: yPosition};
    }
    
    private getTowerColour(index: number, numPlayers: number) {
        var proportion = index / numPlayers;
        var subProportion = proportion * 6 % 1;
        
        var r = 0, g = 0, b = 0;

        var proportionSixth = Math.floor(proportion * 6);

        switch (proportionSixth) {
        case 0:
            r = 255;
            g = Math.floor(subProportion * 255);
            break;
        case 1:
            r = 255 - Math.floor(subProportion * 255);
            g = 255;
            break;
        case 2:
            g = 255;
            b = Math.floor(subProportion * 255);
            break;
        case 3:
            g = 255 - Math.floor(subProportion * 255);
            b = 255;
            break;
        case 4:
            b = 255;
            r = Math.floor(subProportion * 255);
            break;
        case 5:
            b = 255 - Math.floor(subProportion * 255);
            r = 255;
            break;
        }
    
        return this.sketch.color(r, g, b);
    }
}
