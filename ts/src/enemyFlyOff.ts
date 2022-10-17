namespace zlsSpaceInvader {

    const v = new Vector2
    const turningSpeed = Math.PI
    const moveSpeed = 36    
    const padding = 4.5

    export class EnemyFlyOff {

        private direction = new Vector2( 0, -1 )
        private state: "homing" | "goStraight" | "regroup" = "homing"
        private time = 0
        

        constructor(
            readonly enemy: EnemyFlight,
            readonly regroupPos: Vector2
        ){
            Audio.play( Audio.sounds.shipFly, 1 )
        }

        update( deltaTime: number, playerFlight: PlayerFlight ){

            this.time += deltaTime

            let targetPos: Vector2 | undefined

            switch( this.state ){
            case "homing":
                targetPos = playerFlight.pos
                break
            case "regroup":
                targetPos = this.regroupPos
                break
            }

            if( targetPos ){
                v.sub( targetPos, this.enemy.pos )
                if(
                    this.time<2.5 ||
                    this.state==="regroup"
                ){
                    let angle = v.angle(this.direction)
                    if( angle<-Math.PI ){
                        angle += Math.PI*2
                    }
                    const turningAngle = Math.min(Math.abs(angle),turningSpeed*deltaTime)
                    this.direction.rotateAround(
                        Math.sign(angle)*turningAngle
                    )
                    this.enemy.rotate = this.direction.angle()-Math.PI/2
                }else{
                    switch( this.state ){
                    case "homing":
                        this.state = "goStraight"
                        break
                    }
                }

                this.enemy.vel.copy(this.direction).multiply(moveSpeed)

                switch( this.state ){
                case "regroup":
                    v.sub( this.regroupPos, this.enemy.pos )
                    if( v.length()<padding ){
                        this.enemy.endFlyOff()
                    }
                }
            }
        }

        onWrapY(){
            this.state = "regroup"
        }

    }

}