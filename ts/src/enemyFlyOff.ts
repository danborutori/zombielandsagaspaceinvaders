namespace zlsSpaceInvader {

    const v = new Vector2
    const turningSpeed = Math.PI
    const moveSpeed = 36    
    const padding = 4.5

    export class EnemyFlyOff<T extends EnemyFlight> {

        protected direction = new Vector2( 0, -1 )
        protected state: "homing" | "goStraight" | "regroup" | "stop" = "homing"
        protected time = 0
        private shootCooldown = 0
        private bulletCount = 3

        constructor(
            readonly enemy: T,
            readonly regroupPos: Vector2
        ){
            Audio.play( Audio.sounds.shipFly )
        }

        update( deltaTime: number, playerFlight: PlayerFlight ){

            this.time += deltaTime
            this.shootCooldown -= deltaTime

            let targetPos: Vector2 | undefined

            switch( this.state ){
            case "homing":
                targetPos = playerFlight.pos
                if( this.shootCooldown<=0 &&
                    this.bulletCount>0
                ){
                    this.enemy.shoot(playerFlight)
                    this.shootCooldown += 0.5
                    this.bulletCount--
                }
                break
            case "regroup":
                targetPos = this.regroupPos
                break
            case "stop":
                targetPos = v.set(this.enemy.pos.x, this.enemy.pos.y+100)
                break
            }

            if( targetPos ){
                v.sub( targetPos, this.enemy.pos )
                if(
                    this.time<2.5 ||
                    this.state==="regroup" ||
                    this.state==="stop"
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

                switch( this.state ){
                case "regroup":
                    v.sub( this.regroupPos, this.enemy.pos )
                    if( v.length()<padding ){
                        this.enemy.endFlyOff()
                    }
                }
            }

            switch( this.state ){
            case "stop":
                this.enemy.vel.set(0,0)
                break
            default:
                this.enemy.vel.copy(this.direction).multiply(moveSpeed)
                break
            }
        }

        onWrapY(){
            this.state = "regroup"
        }

        onDie(){}

    }

}