export class Spark{
    private x: number;
    private y: number;
    private colour: any;
    private size: number;
    private longevity: number;
    private age: number = 0;

    private vX: number;
    private vY: number;

    constructor(colour: any, x: number, y: number){
        this.x = x;
        this.y = y;

        this.longevity = Math.random() * 20;

        this.vX = 2 * (Math.floor(4 * Math.random()) + 1) - 5;
        this.vY = 2 * (Math.floor(4 * Math.random()) + 1) - 5;
    
        this.colour = colour;
    
        this.size = Math.floor(Math.random() * 4) + 1;
    }

    public draw(sketch): boolean{
        this.x += this.vX;
        this.y += this.vY;
    
        sketch.fill(this.colour);
        sketch.noStroke();
        sketch.circle(this.x, this.y, this.size);

        this.age++;
        return this.age < this.longevity;
    }
}