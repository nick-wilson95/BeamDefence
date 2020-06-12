import { Vectors } from "./vectors";

export class Sketch {  
  static lineThroughPoint = (sketch, originX: number, originY: number, pointX: number, pointY: number, length: number) => {
    var mouseDistance = Vectors.distance(originX, originY, pointX, pointY);
  
    if (mouseDistance == 0) {
      sketch.line(originX, originY, originX + length, originY);
      return;
    }
  
    var xTarget = originX + (pointX - originX) * length / mouseDistance;
    var yTarget = originY + (pointY - originY) * length / mouseDistance;
  
    sketch.line(originX, originY, xTarget, yTarget);
  }
}