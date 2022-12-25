namespace zlsSpaceInvader {

    const v1 = new Vector2
    const v2 = new Vector2

    const lifeDuration = 1
    const laserHitInterval = 0.2

    export class FingerBeam extends PlayerBullet {

        private time = 0
        collisionShape!: ColliderLineSegment

        private hitCooldown = 0
        private isHit = false
        get canHit(){
            return this.hitCooldown<=0
        }

        constructor(
            readonly shooter: PlayerFlight,
            readonly unit: FlightUnit,
            readonly clockwise: number
        ){
            super(
                shooter,
                unit.bulletColor
            )
            this.collisionShape = new ColliderLineSegment()
            this.cancelEnemyBullet = true
            this.damage = 0.1
        }

        update(deltaTime: number): void {
            super.update( deltaTime )

            this.time += deltaTime
            if( this.hitCooldown>0 )
                this.hitCooldown -= deltaTime

            this.pos.add( this.shooter.pos, this.unit.pos )
            this.pos.y -= 6

            this.collisionShape.from.set(0,0)
            this.collisionShape.to.set(0,-400)
            .rotateAround(
                mix(
                    Math.PI/2*this.clockwise,
                    -Math.PI/2*this.clockwise,
                    Math.pow(this.time/lifeDuration,0.25)))

            if( this.time>=lifeDuration ){
                this.removeFromManager()
            }

            if( this.isHit ){
                this.hitCooldown += laserHitInterval
                this.isHit = false
            }
        }

        onHitEnemy( hitPos: Vector2 ): void {
            this.spark( hitPos )
            this.isHit = true
        }        

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            ctx.fillStyle = this.color
            const width = 1-this.time/lifeDuration
            v1.add( this.collisionShape.from, this.pos )
            v2.add( this.collisionShape.to, this.pos )
            drawLine(
                v1,
                v2,
                3*width,
                ctx
            )
            ctx.fillStyle = "white"
            if( width>0.3 ){
                drawLine(
                    v1,
                    v2,
                    1*width,
                    ctx
                )
            }
        }
    }

}