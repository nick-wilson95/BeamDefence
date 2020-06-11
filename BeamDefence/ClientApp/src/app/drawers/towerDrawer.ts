import { IPlayer } from "../models/player";
import { IEnemy } from "../models/enemy";
import { Sketch } from "../utils/sketch";
import { Vectors } from "../utils/vectors";

export class TowerDrawer{
    static readonly towerDistance = 50;
    sketch: any;
    player: IPlayer;
    towerIndex: number;
    numTowers: number;

    constructor(sketch: any, player: IPlayer, towerIndex: number, numTowers: number) {
        this.sketch = sketch;
        this.player = player;
        this.towerIndex = towerIndex;
        this.numTowers = numTowers;
    }
    
    draw(enemies: IEnemy[], onEnemyHit: (colour: any, enemy: IEnemy, position: {x: number, y: number}) => void) {
        var position = this.getTowerPosition(this.towerIndex, this.numTowers);

        var colour = this.getTowerColour(this.towerIndex, this.numTowers);

        this.sketch.noStroke();
      
        var towerBaseColour = this.sketch.color(50, 50, 50);
        this.sketch.fill(towerBaseColour);
        this.sketch.circle(position.x, position.y, 40);
        
        var towerColour = this.sketch.color(100, 100, 100);
        this.sketch.fill(towerColour);
        this.sketch.circle(position.x, position.y, 30);
      
        this.sketch.stroke(colour);  
      
        var strokeWeight = 8
        this.sketch.strokeWeight(strokeWeight);
      
        Sketch.lineThroughPoint(this.sketch, position.x, position.y, this.player.mouse.x, this.player.mouse.y, 18);
        
        this.drawBeam(enemies, colour, position.x, position.y, onEnemyHit);
    }

    private drawBeam(enemies: IEnemy[], colour, xPosition: number, yPosition: number, onEnemyHit: (colour: any, enemy: IEnemy, position: {x: number, y: number}) => void) {
        colour.setAlpha(150);
        this.sketch.stroke(colour);
        colour.setAlpha(255);
        
        var strokeWeight = 2 + Math.floor(Math.random() * 2);
        this.sketch.strokeWeight(strokeWeight);
        
        var mouseX = this.player.mouse.x;
        var mouseY = this.player.mouse.y;

        Sketch.lineThroughPoint(this.sketch, xPosition, yPosition, mouseX, mouseY, this.sketch.width);
        
        enemies.forEach(e => {
            if (Vectors.pointToHalfLineDistance(e.position.x, e.position.y, xPosition, yPosition, mouseX, mouseY) < e.radius){
                var enemyDist = Vectors.distance(xPosition, yPosition, e.position.x, e.position.y);
                var mouseDist = Vectors.distance(xPosition, yPosition, mouseX, mouseY);

                var hitLocation = {x: xPosition + (mouseX-xPosition) * enemyDist/mouseDist, y: yPosition + (mouseY-yPosition) * enemyDist/mouseDist};
                onEnemyHit(colour, e, hitLocation);
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