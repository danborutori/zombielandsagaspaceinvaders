namespace zlsSpaceInvader {

    interface Vector2Like {x: number, y: number}

    export class Vector2 {
        x: number
        y: number

        constructor( x: number = 0, y: number = 0){
            this.x = x
            this.y = y
        }

        copy( v: Vector2Like){
            this.x = v.x
            this.y = v.y
        }

        distance( v: Vector2Like) {
            const dx = this.x-v.x
            const dy = this.y-v.y
            return Math.sqrt(dx*dx+dy*dy)
        }
    }

}