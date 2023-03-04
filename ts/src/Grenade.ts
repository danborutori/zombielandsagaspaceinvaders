namespace zlsSpaceInvader {

    const v1 = new Vector2
    const colliderBox = new ColliderBox( new Vector2(6,6))

    export class Grenade extends EnemyBullet {
        
        private time = 0
        private ntdPlayer?: PlayerFlight

        constructor(
            stage: Stage,
            direction: Vector2,
            shooter: EnemyFlight,
            speed?:number,
            readonly phase: number = 0
        ){
            super(stage, direction, shooter, speed)
            this.collisionShape = colliderBox

            this.shouldCollidePlayerBullet = ()=>true
            this.onCollidePlayerBullet = (b, hitPos)=>{
                this.velocity.y *= -1
                this.color = b.color
                this.ntdPlayer = b.shooter
                this.canHitPlayer = false
                b.onHitEnemy(hitPos)
                this.shouldCollidePlayerBullet = ()=>false
                this.onCollidePlayerBullet = undefined
            }
        }

        update( deltaTime: number ){
            super.update( deltaTime )
            this.time += deltaTime

            if( this.manager ){

                if( this.time>1 ){
                    let segment = 8
                    switch(DifficultyManager.shared.difficulty){
                    case "easy":
                        segment = 5
                        break
                    }
                    for( let i=0; i<segment; i++ ){
                        const a = i*Math.PI*2/segment+this.phase
                        let b: Bullet
                        if(this.ntdPlayer){
                            b = new PlayerBullet(
                                this.ntdPlayer,
                                this.color
                            )
                            b.velocity.set(
                                Math.sin(a),
                                -Math.cos(a)
                            ).multiply(Constant.bulletSpeed)
                        }else{
                            b = new EnemyBullet(
                                this.stage,
                                v1.set(
                                    Math.sin(a),
                                    -Math.cos(a)
                                ),
                                this.shooter
                            )
                        }
                        b.pos.copy(this.pos)
                        this.manager.add(b)
                    }
                    this.removeFromManager()
                }
            }
        }
        
        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            const spr = Sprites.shared.images["grenade"]
            ctx.save()
            ctx.translate(Math.floor(this.pos.x), Math.floor(this.pos.y))
            ctx.rotate(this.time*Math.PI*4)
            ctx.drawImage(
                spr,
                Math.floor(-spr.width/2),
                Math.floor(-spr.height/2)
            )
            ctx.restore()
        }

    }

}