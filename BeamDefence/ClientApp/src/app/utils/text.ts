export class TextUtils {
    static topLeftText(sketch, text: string) {
        sketch.fill(255, 255, 255);
        sketch.noStroke();
        sketch.textSize(20);
        sketch.textAlign(sketch.LEFT, sketch.TOP);
        sketch.text(text, 10, 10);
    }
    
    static topRightText(sketch, text: string) {
        sketch.fill(255, 255, 255);
        sketch.noStroke();
        sketch.textSize(12);
        sketch.textAlign(sketch.RIGHT, sketch.TOP);
        sketch.text(text, sketch.width - 10, 10);
    }
    
    static bottomRightText(sketch, text: string) {
        sketch.fill(255, 255, 255);
        sketch.noStroke();
        sketch.textSize(12);
        sketch.textAlign(sketch.RIGHT, sketch.BOTTOM);
        sketch.text(text, sketch.width - 10, sketch.height - 10);
    }
    
    static centreText(sketch, text: string) {
        sketch.fill(255, 255, 255);
        sketch.stroke(0, 0, 0);
        sketch.strokeWeight(4);
        sketch.textSize(30);
        sketch.textAlign(sketch.CENTER, sketch.CENTER);
        sketch.text(text, sketch.width/2, sketch.height/2);
    }
}