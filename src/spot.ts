import {Vector} from "./vector.js"

export class Spot {
    pos: Vector
    h: number
    f: number
    g: number
    neighbors: Array<Spot>
    parent: null | Spot

    constructor(pos: Vector) {
        this.pos = pos
        this.h = 0
        this.f = 0
        this.g = 0
        this.neighbors = []
        this.parent = null
    }

    show(ctx: CanvasRenderingContext2D, color = "#fff") {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
}