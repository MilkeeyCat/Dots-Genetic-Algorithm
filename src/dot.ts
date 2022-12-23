import {Vector} from "./vector.js"
import {Brain} from "./brain.js"
import {aStar} from "./astar.js"
import {Spot} from "./spot.js"
import {Obstacle} from "./obstable.js"
import {checkLineIntersection} from "./utils.js"

const generateSpotsArr = (start: Vector, obstacles: Array<Obstacle>, end: Vector) => {
    const arr = []

    arr.push(new Spot(start))

    for (let i = 0; i < obstacles.length; i++) {
        arr.push(new Spot(new Vector(obstacles[i].pos.x, obstacles[i].pos.y)))
        arr.push(new Spot(new Vector(obstacles[i].pos.x + obstacles[i].width, obstacles[i].pos.y)))
        arr.push(new Spot(new Vector(obstacles[i].pos.x, obstacles[i].pos.y + obstacles[i].height)))
        arr.push(new Spot(new Vector(obstacles[i].pos.x + obstacles[i].width, obstacles[i].pos.y + obstacles[i].height)))
    }

    arr.push(new Spot(end))

    return arr
}

const calcNeighbors = (pos: Spot, obstacles: Array<Obstacle>, end: Spot, spotsArr: Array<Spot>) => {
    const res = new Array(obstacles.length)

    for (let i = 0; i < res.length; i++) {
        res[i] = new Array(4).fill(true)
    }

    let isEnd = true

    for (let i = 0; i < obstacles.length; i++) {
        for (let j = 0; j < obstacles.length; j++) {
            let newEnd = end.pos

            const tempLeft = checkLineIntersection(pos.pos.x, pos.pos.y, newEnd.x, newEnd.y,
                obstacles[j].pos.x, obstacles[j].pos.y, obstacles[j].pos.x, obstacles[j].pos.y + obstacles[j].height)

            const tempTop = checkLineIntersection(pos.pos.x, pos.pos.y, newEnd.x, newEnd.y,
                obstacles[j].pos.x, obstacles[j].pos.y, obstacles[j].pos.x + obstacles[j].width, obstacles[j].pos.y)

            const tempRight = checkLineIntersection(pos.pos.x, pos.pos.y, newEnd.x, newEnd.y,
                obstacles[j].pos.x + obstacles[j].width, obstacles[j].pos.y, obstacles[j].pos.x + obstacles[j].width, obstacles[j].pos.y + obstacles[j].height)

            const tempBottom = checkLineIntersection(pos.pos.x, pos.pos.y, newEnd.x, newEnd.y,
                obstacles[j].pos.x, obstacles[j].pos.y + obstacles[j].height, obstacles[j].pos.x + obstacles[j].width, obstacles[j].pos.y + obstacles[j].height)

            if (isEnd) isEnd = !((tempLeft.onLine2 && tempLeft.onLine1) || (tempTop.onLine1 && tempTop.onLine2) || (tempRight.onLine2 && tempRight.onLine1) || (tempBottom.onLine1 && tempBottom.onLine2))
        }
    }

    if (!isEnd) {
        let newPos = pos.pos

        for (let i = 0; i < obstacles.length; i++) {
            const arr = [
                [obstacles[i].pos.x, obstacles[i].pos.y],
                [obstacles[i].pos.x + obstacles[i].width, obstacles[i].pos.y],
                [obstacles[i].pos.x, obstacles[i].pos.y + obstacles[i].height],
                [obstacles[i].pos.x + obstacles[i].width, obstacles[i].pos.y + obstacles[i].height],
            ]

            for (let j = 0; j < obstacles.length; j++) {

                for (let o = 0; o < arr.length; o++) {
                    const left = checkLineIntersection(newPos.x, newPos.y, arr[o][0], arr[o][1],
                        obstacles[j].pos.x, obstacles[j].pos.y, obstacles[j].pos.x, obstacles[j].pos.y + obstacles[j].height)

                    const top = checkLineIntersection(newPos.x, newPos.y, arr[o][0], arr[o][1],
                        obstacles[j].pos.x, obstacles[j].pos.y, obstacles[j].pos.x + obstacles[j].width, obstacles[j].pos.y)

                    const right = checkLineIntersection(newPos.x, newPos.y, arr[o][0], arr[o][1],
                        obstacles[j].pos.x + obstacles[j].width, obstacles[j].pos.y, obstacles[j].pos.x + obstacles[j].width, obstacles[j].pos.y + obstacles[j].height)

                    const bottom = checkLineIntersection(newPos.x, newPos.y, arr[o][0], arr[o][1],
                        obstacles[j].pos.x, obstacles[j].pos.y + obstacles[j].height, obstacles[j].pos.x + obstacles[j].width, obstacles[j].pos.y + obstacles[j].height)

                    if (res[i][o]) {
                        res[i][o] = !((left.onLine2 && left.onLine1) || (top.onLine1 && top.onLine2) || (right.onLine2 && right.onLine1) || (bottom.onLine1 && bottom.onLine2))
                    }
                }
            }
        }

        for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < res[0].length; j++) {
                if (res[i][j]) {
                    const neighbor = spotsArr[i * res[0].length + j + 1]

                    if (neighbor !== pos) {
                        pos.neighbors.push(neighbor)
                    }
                }
            }
        }
    } else {
        for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < res[i].length; j++) {
                res[i][j] = false
            }
        }

        pos.neighbors.push(end)
    }

    return res
}

export class Dot {
    pos: Vector
    vel: Vector
    acc: Vector
    brain: Brain
    fitness: number
    goal: Vector
    reachedGoal: boolean = false
    isBest: boolean
    dead: boolean
    obstacles: Array<Obstacle>

    constructor(goal: Vector, obstacles: Array<Obstacle>) {
        this.pos = new Vector(window.innerWidth / 2, window.innerHeight / 2)
        this.vel = new Vector(0, 0)
        this.acc = new Vector(0, 0)
        this.brain = new Brain(400)
        this.fitness = 0
        this.goal = goal
        this.obstacles = obstacles
    }

    show(ctx: CanvasRenderingContext2D | null | undefined) {
        if (ctx) {
            ctx.save()
            ctx.beginPath()
            let r = 2

            if (this.isBest) {
                ctx.fillStyle = "red"
                r = 4
            }

            ctx.arc(this.pos.x, this.pos.y, r, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()
            ctx.restore()
        }
    }

    move() {
        if (this.brain.directions.length > this.brain.step) {
            this.acc = this.brain.directions[this.brain.step]
            this.brain.step++
        } else {
            this.dead = true
        }

        this.vel.add(this.acc)
        this.vel.limit(5)
        this.pos.add(this.vel)
    }

    update() {
        if (!this.dead && !this.reachedGoal) {
            this.move()

            for (let i = 0; i < this.obstacles.length; i++) {
                if (this.pos.x > this.obstacles[i].pos.x && this.pos.x < this.obstacles[i].pos.x + this.obstacles[i].width
                    && this.pos.y > this.obstacles[i].pos.y && this.pos.y < this.obstacles[i].pos.y + this.obstacles[i].height) {
                    this.dead = true
                }
            }

            if (this.pos.x < 2 || this.pos.x > window.innerWidth - 2 || this.pos.y < 2 || this.pos.y > window.innerHeight - 2) {
                this.dead = true
            } else if (Vector.dist(this.pos, this.goal) < 5) {
                this.reachedGoal = true
            }
        }
    }

    calculateFitness() {
        const spotsArr = generateSpotsArr(this.pos, this.obstacles, this.goal)

        const newStart = spotsArr[0]
        const newGoal = spotsArr[spotsArr.length - 1]

        for (let i = 0; i < spotsArr.length; i++) {
            calcNeighbors(spotsArr[i], this.obstacles, newGoal, spotsArr)
        }


        const res = aStar(newStart, newGoal)

        let len = 0

        for (let i = 0; i < res.length - 1; i++) {
            len += Vector.dist(res[i].pos, res[i + 1].pos)
        }

        if (this.reachedGoal) {
            this.fitness = 1 / 16 + 10000 / (this.brain.step ** 2)
        } else {
            this.fitness = 1 / ((len) ** 2)
        }

    }

    gimmeBaby() {
        const baby = new Dot(this.goal, this.obstacles)
        baby.brain = this.brain.clone()

        return baby
    }
}