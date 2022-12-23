import {Vector} from "./vector.js"

export class Obstacle {
    pos: Vector
    color: string
    width: number
    height: number

    constructor(pos: Vector, width: number, height: number, color = "#000") {
        this.pos = pos
        this.width = width
        this.height = height
        this.color = color
    }

    show(ctx: CanvasRenderingContext2D | null | undefined) {
        if (ctx) {
            ctx.save()
            ctx.fillStyle = this.color
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
            ctx.restore()
        }
    }
}