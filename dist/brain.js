import { Vector } from "./vector.js";
export class Brain {
    constructor(size) {
        this.directions = new Array(size);
        this.randomize();
        this.step = 0;
    }
    randomize() {
        for (let i = 0; i < this.directions.length; i++) {
            const randomAngle = Math.floor(Math.random() * 360);
            this.directions[i] = Vector.fromAngle(randomAngle);
        }
    }
    clone() {
        const clone = new Brain(this.directions.length);
        for (let i = 0; i < this.directions.length; i++) {
            clone.directions[i] = this.directions[i];
        }
        return clone;
    }
    mutate() {
        const mutationRate = 0.01;
        for (let i = 0; i < this.directions.length; i++) {
            const rand = Math.random();
            if (mutationRate > rand) {
                this.directions[i] = Vector.fromAngle(Math.floor(Math.random() * 360));
            }
        }
    }
}
//# sourceMappingURL=brain.js.map