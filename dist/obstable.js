export class Obstacle {
    constructor(pos, width, height, color = "#000") {
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    show(ctx) {
        if (ctx) {
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
            ctx.restore();
        }
    }
}
//# sourceMappingURL=obstable.js.map