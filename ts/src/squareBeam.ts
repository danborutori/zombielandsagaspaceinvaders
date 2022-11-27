namespace zlsSpaceInvader {

    const v1 = new Vector2
    const v2 = new Vector2
    const laserSpeed = 400

    const emptyShape = new ColliderCompoundShape()
    
    export class SquareBeam extends PlayerBullet {

        private target = new Vector2
        private turnAllowance = 1
        private path: Vector2[] = []
        private decay = false
        private drawLength = laserSpeed
        private prevSign = 0

        constructor(
            shooter: PlayerFlight,
            unit: FlightUnit
        ){
            super( shooter.stage, unit.bulletColor )
            this.velocity.normalize().multiply(laserSpeed)
            if( shooter.manager ){
                const es = Array.from(shooter.manager.enemyFlights)
                if( es.length>0 ){
                    this.target.copy( es[Math.floor(Math.random()*es.length)].pos )
                }
            }
        }

        private setDrawLength(){
            this.drawLength = 0
            for( let i=this.path.length-1; i>0; i-- ){
                this.drawLength += this.path[i].distance(this.path[i-1])
            }
        }

        protected offscreenCheck(): void {
            if( this.pos.y<=this.stage.top ||
                this.pos.y>=this.stage.bottom
            ){
                this.decay = true
                this.drawLength = 0
                this.setDrawLength()
            }
        }

        onHitEnemy(hitPoint: Vector2): void {
            this.spark( hitPoint )
            this.collisionShape = emptyShape
        }

        update(deltaTime: number): void {
            super.update( deltaTime )

            
            if( this.path.length==0){
                this.path.push( this.pos.clone() )
                this.path.push( this.pos.clone() )
            }

            this.path[this.path.length-1].copy( this.pos )

            if( this.turnAllowance>0 ){
                const d = Math.sign( v1.sub( this.target, this.pos ).normalize().dot( this.velocity ) )
                if( this.prevSign!=0 && d!=this.prevSign ){
                    const angle = v1.angle( v2.copy( this.velocity ).normalize())
                    this.velocity.rotateAround( angle>0?Math.PI/2:-Math.PI/2 )
                    this.turnAllowance--
                    this.path.push(this.pos.clone())
                }
                this.prevSign = d
            }

            if( this.decay ){
                this.drawLength -= deltaTime*laserSpeed
            }

            let len = 0
            for( let i=this.path.length-1; i>0; i-- ){
                len += this.path[i].distance(this.path[i-1])
                if( len>this.drawLength ){
                    this.path[i-1].add( 
                        v1.sub(this.path[i], this.path[i-1]).normalize().multiply(
                            len-this.drawLength
                        )
                    )
                    this.path.splice(0, i-1)
                    break
                }
            }

            if( this.drawLength<=0 ){
                this.removeFromManager()
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            ctx.fillStyle = this.color
            for( let i=0; i<this.path.length-1; i++ ){
                drawLine(
                    this.path[i],
                    this.path[i+1],
                    2,
                    ctx
                )    
            }
            ctx.fillStyle = "white"
            for( let i=0; i<this.path.length-1; i++ ){
                drawLine(
                    this.path[i],
                    this.path[i+1],
                    1,
                    ctx
                )    
            }
        }
    }

}