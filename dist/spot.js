export class Spot {
    constructor(pos) {
        this.pos = pos;
        this.h = 0;
        this.f = 0;
        this.g = 0;
        this.neighbors = [];
        this.parent = null;
    }
    show(ctx, color = "#fff") {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}
//# sourceMappingURL=spot.js.map