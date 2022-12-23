export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }
    static fromAngle(angle) {
        return new Vector(Math.cos(Math.PI * 2 * angle / 360), Math.sin(Math.PI * 2 * angle / 360));
    }
    magSq() {
        return this.x * this.x + this.y * this.y;
    }
    div(num) {
        this.x /= num;
        this.y /= num;
    }
    mult(num) {
        this.x *= num;
        this.y *= num;
    }
    limit(max) {
        const mSq = this.magSq();
        if (mSq > max * max) {
            this.div(Math.sqrt(mSq));
            this.mult(max);
        }
    }
    static dist(vec1, vec2) {
        return Math.sqrt((vec2.x - vec1.x) ** 2 + (vec2.y - vec1.y) ** 2);
    }
}
//# sourceMappingURL=vector.js.map