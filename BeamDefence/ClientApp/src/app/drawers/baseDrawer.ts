import { TowerDrawer } from "./towerDrawer";

export class BaseDrawer {
    static counter = 0;

    static draw(sketch: any, remainingHealth: number) {
        var healthProportion = remainingHealth / 100;

        BaseDrawer.counter += 1 + (2 - 2 * healthProportion);

        var cycleProportion = Math.abs((BaseDrawer.counter / 60) % 2 - 1);

        var gbLevel = 255 * (1 - cycleProportion * (1 - healthProportion));
        
        var nexusColour = sketch.color(255, gbLevel, gbLevel);
        var baseOuterColour = sketch.color(50, 50, 50);
        var baseInnerColour = sketch.color(100, 100, 100);
        
        sketch.noFill();
        sketch.strokeWeight(6);

        sketch.stroke(baseOuterColour);
        sketch.circle(sketch.width/2, sketch.height/2, 2 * TowerDrawer.towerDistance);

        sketch.stroke(baseInnerColour);
        sketch.circle(sketch.width/2, sketch.height/2, 2 * TowerDrawer.towerDistance - 12);

        sketch.noStroke();
        sketch.fill(nexusColour);
        sketch.circle(sketch.width/2, sketch.height/2, 10 * (2 + cycleProportion));
    }
}