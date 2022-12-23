import { Dot } from "./dot.js";
export class Population {
    constructor(count, goal, obstacles) {
        this.generation = 0;
        this.bestFitness = 0;
        this.minStep = 400;
        this.dots = new Array(count);
        this.goal = goal;
        this.obstacles = obstacles;
        for (let i = 0; i < count; i++) {
            this.dots[i] = new Dot(goal, obstacles);
        }
    }
    show(ctx) {
        for (let j = 0; j < this.obstacles.length; j++) {
            this.obstacles[j].show(ctx);
        }
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].show(ctx);
        }
    }
    update() {
        for (let i = 0; i < this.dots.length; i++) {
            if (this.dots[i].brain.step > this.minStep)
                this.dots[i].dead = true;
            this.dots[i].update();
        }
    }
    calculateFitness() {
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].calculateFitness();
        }
    }
    allDotsDead() {
        for (let i = 0; i < this.dots.length; i++) {
            if (!this.dots[i].dead && !this.dots[i].reachedGoal) {
                return false;
            }
        }
        return true;
    }
    calculateFitnessSum() {
        this.fitnessSum = 0;
        for (let i = 0; i < this.dots.length; i++) {
            this.fitnessSum += this.dots[i].fitness;
        }
    }
    naturalSelection() {
        const newDots = new Array(this.dots.length);
        this.setBestDot();
        this.calculateFitnessSum();
        newDots[0] = this.dots[this.bestDot].gimmeBaby();
        newDots[0].isBest = true;
        for (let i = 1; i < newDots.length; i++) {
            const parent = this.selectParent();
            newDots[i] = parent.gimmeBaby();
        }
        this.dots = newDots;
        this.generation++;
    }
    selectParent() {
        const rand = Math.random() * this.fitnessSum;
        let runningSum = 0;
        for (let i = 0; i < this.dots.length; i++) {
            runningSum += this.dots[i].fitness;
            if (runningSum > rand) {
                return this.dots[i];
            }
        }
        return null;
    }
    mutateBabies() {
        for (let i = 1; i < this.dots.length; i++) {
            this.dots[i].brain.mutate();
        }
    }
    setBestDot() {
        let max = 0;
        let maxIndex = 0;
        for (let i = 0; i < this.dots.length; i++) {
            if (this.dots[i].fitness > max) {
                max = this.dots[i].fitness;
                maxIndex = i;
            }
        }
        this.bestDot = maxIndex;
        this.bestFitness = this.dots[maxIndex].fitness;
        if (this.dots[this.bestDot].reachedGoal) {
            this.minStep = this.dots[this.bestDot].brain.step;
        }
    }
}
//# sourceMappingURL=population.js.map