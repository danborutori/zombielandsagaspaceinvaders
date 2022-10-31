namespace zlsSpaceInvader {

    interface Vector2Like {x: number, y: number}

    export class Vector2 {
        x: number
        y: number

        constructor( x: number = 0, y: number = 0){
            this.x = x
            this.y = y
        }

        clone(){
            return new Vector2(this.x, this.y)
        }

        copy( v: Vector2Like){
            this.x = v.x
            this.y = v.y
            return this
        }

        distance( v: Vector2Like) {
            const dx = this.x-v.x
            const dy = this.y-v.y
            return Math.sqrt(dx*dx+dy*dy)
        }

        set( x: number, y: number ){
            this.x = x
            this.y = y
            return this
        }

        floor(){
            this.x = Math.floor(this.x)
            this.y = Math.floor(this.y)
            return this
        }

        add( v1: Vector2Like, v2: Vector2Like ): this
        add( v1: Vector2Like ): this
        add( v1: Vector2Like, v2?:  Vector2Like ){
            if( !v2 ){
                this.x += v1.x
                this.y += v1.y
            }else{
                this.x = v1.x+v2.x
                this.y = v1.y+v2.y
            }

            return this
        }
        
        addScaled( v: Vector2Like, scale: number ){
            this.x += v.x * scale
            this.y += v.y * scale

            return this
        }

        sub( v1: Vector2Like ): this
        sub( v1: Vector2Like, v2: Vector2Like ): this
        sub( v1: Vector2Like, v2?: Vector2Like ){
            if( v2 ){
                this.x = v1.x-v2.x
                this.y = v1.y-v2.y
            }else{
                this.x -= v1.x
                this.y -= v1.y
            }
            return this
        }

        multiply( n: number ){
            this.x *= n
            this.y *= n
        }

        abs(){
            this.x = Math.abs(this.x)
            this.y = Math.abs(this.y)
        }

        length(){
            return Math.sqrt(this.x*this.x+this.y*this.y)
        }

        normalize(){
            const l = this.length()
            if( l!=0 )
                this.multiply(1/l)
            return this
        }

        angle(): number
        angle(v: Vector2): number
        angle(v?: Vector2) { 
            if( v===undefined ){
                // FROM: https://github.com/mrdoob/three.js/blob/dev/src/math/Vector2.js
                // computes the angle in radians with respect to the positive x-axis
        
                const angle = Math.atan2( - this.y, - this.x ) + Math.PI
        
                return angle
            }else{

                return this.angle()-v.angle()

            }    
        }

        // FROM: https://github.com/mrdoob/three.js/blob/dev/src/math/Vector2.js
        rotateAround( angle: number ) {

            const c = Math.cos( angle ), s = Math.sin( angle )
    
            const x = this.x
            const y = this.y
    
            this.x = x * c - y * s
            this.y = x * s + y * c
    
            return this;
    
        }
    }

}