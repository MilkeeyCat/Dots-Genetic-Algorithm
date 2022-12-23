import {Vector} from "./vector.js"
import {Spot} from "./spot.js"

const heuricstic = (a: Vector, b: Vector) => {
    return Vector.dist(a, b)
}

export const aStar = (start: Spot, end: Spot) => {
    const openSet: Array<Spot> = [start]
    const closedSet: Array<Spot> = []
    const path: Array<Spot> = []
    let foundPath = false

    while (openSet.length > 0 && !foundPath) {
        let winner = 0

        for (let i = 1; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i
            }
        }

        let current = openSet[winner]

        if (current == end) {
            let temp = current
            path.push(temp)

            while (temp.parent !== null) {
                path.push(temp.parent)
                temp = temp.parent
            }
        }


        for (let i = openSet.length - 1; i >= 0; i--) {
            if (openSet[i] == current) {
                openSet.splice(i, 1)
            }
        }

        closedSet.push(current)

        const neighbors = current.neighbors

        for (let i = 0; i < neighbors.length; i++) {
            const neighbor = neighbors[i]

            if (!closedSet.includes(neighbor)) {
                const tempG = current.g + Vector.dist(neighbor.pos, current.pos)
                if (openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG
                    }
                } else {
                    neighbor.g = tempG
                    openSet.push(neighbor)
                }

                neighbor.g = tempG
                neighbor.h = heuricstic(neighbor.pos, end.pos)
                neighbor.f = neighbor.g + neighbor.h
                neighbor.parent = current
            } else continue
        }
    }

    return path
}