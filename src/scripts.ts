import {Vector} from "./vector.js"
import {Obstacle} from "./obstable.js"
import {Population} from "./population.js"

const
    canvas = document.querySelector("#canvas") as HTMLCanvasElement | null,
    ctx = canvas?.getContext("2d")

if (canvas) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

if (!ctx) {
    throw Error("Context couldn't be created D:")
}

const goal = new Vector(window.innerWidth / 2, 20)

const obstacles = [
    new Obstacle(new Vector(500, 100), 1100, 30, "#FFB375FF"),
    new Obstacle(new Vector(400, 100), 30, 700, "#FFB375FF"),
    new Obstacle(new Vector(500, 0), 30, 70, "#FFB375FF"),
    new Obstacle(new Vector(800, 190), 30, 400, "#FFB375FF"),
    new Obstacle(new Vector(1100, 190), 30, 400, "#FFB375FF"),
    new Obstacle(new Vector(1650, 0), 30, window.innerHeight, "#FFB375FF")
]

const population = new Population(500, goal, obstacles)

const draw = () => {
    if (population.allDotsDead()) {
        population.calculateFitness()
        population.naturalSelection()
        population.mutateBabies()
    } else {
        population.show(ctx)
        population.update()
    }

    ctx.font = "20px sans-serif"
    ctx.fillText(`Gen: ${population.generation}`, 10, 50)
    ctx.fillText(`Best steps: ${population.minStep}`, 10, 70)
    ctx.fillText(`Best fitness: ${population.bestFitness}`, 10, 90)

    ctx.arc(goal.x, goal.y, 5, 0, Math.PI * 2)
    ctx.fill()
}

const requestAnimationFrameCallback = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    draw()
    window.requestAnimationFrame(requestAnimationFrameCallback)
}

window.requestAnimationFrame(requestAnimationFrameCallback)