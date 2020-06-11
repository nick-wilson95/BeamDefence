export class Vectors{  
    static distance = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt(
      Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2)
    );

    static dot(x1: number, y1: number, x2: number, y2: number): number {
      return x1*x2 + y1*y2;
    }

    static pointToHalfLineDistance(pointX: number, pointY: number, originX: number, originY: number, lineX: number, lineY: number): number {
      var relPointX = pointX - originX;
      var relPointY = pointY - originY;
      var relLineX = lineX - originX;
      var relLineY = lineY - originY;
  
      if (Vectors.dot(relLineX, relLineY, relPointX, relPointY) < 0) return Vectors.distance(relPointX, relPointY, 0, 0);
  
      var hyp = Vectors.distance(pointX, pointY, originX, originY);
      var lineSegDist = Vectors.distance(originX, originY, lineX, lineY);
  
      var adj = Vectors.dot(relPointX, relPointY, (relLineX)/lineSegDist, (relLineY)/lineSegDist)
      
      var distance = Math.sqrt(Math.pow(hyp, 2) - Math.pow(adj, 2));
  
      return distance;
    }
}