namespace zlsSpaceInvader {

    const v1 = new Vector2
    const v2 = new Vector2
    const v3 = new Vector2

    const collisioShape = new ColliderBox(v1.set(1,3))

    export function drawLine(
        from: Vector2,
        to: Vector2,
        width: number,
        ctx: CanvasRenderingContext2D
    ){
        const dir = v1.sub(to, from )
        const dist = Math.round(dir.length())
        dir.normalize()
        const pt = v2.copy(from)

        for( let i=0; i<dist; i++ ){
            ctx.fillRect(
                Math.floor(pt.x-width/2),
                Math.floor(pt.y-width/2),
                Math.ceil(width),
                Math.ceil(width)
            )
            pt.add(dir)
        }
    }

    export class Bullet extends GameObject {

        readonly isBullet = true
        readonly velocity = new Vector2
        collisionShape: ColliderShape = collisioShape
        
        protected constructor(
            readonly stage: Stage,
            public color: string
        ){
            super()
        }

        protected offscreenCheck(){
            if( this.pos.y<=this.stage.top ||
                this.pos.y>=this.stage.bottom
            ){
                this.removeFromManager()
            }
        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            this.pos.addScaled(this.velocity,deltaTime)
            this.offscreenCheck()
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime, ctx)
            ctx.fillStyle = this.color
            v1.copy(this.velocity).normalize()
            drawLine( 
                v2.copy(this.pos).floor().addScaled(v1,1.5),
                v3.copy(this.pos).floor().addScaled(v1,-1.5),
                1,
                ctx
            )
        }
    }

    class PlayerBulletSpark extends AnimatedSpriteObject {
        constructor(
            color: string
        ){
            super([
                ColoredSprite.shared.get(color, Sprites.shared.images.heart0),
                ColoredSprite.shared.get(color, Sprites.shared.images.heart1)
            ],
            0.15)
        }
    }

    export class PlayerBullet extends Bullet {
        readonly isPlayerBullet = true
        cancelEnemyBullet = false
        get canHit(){
            return true
        }
        damage = 1

        constructor(
            stage: Stage,
            color: string
        ){
            super( stage, color )
            this.velocity.set(0, -Constant.bulletSpeed )
        }

        protected spark( sparkPos?: Vector2 ){
            if( this.manager ){
                const s = new PlayerBulletSpark(this.color)
                s.pos.copy(sparkPos || this.pos)
                this.manager.add(s)
            }
        }

        onHitEnemy( hitPoint: Vector2 ){
            this.spark()
            this.removeFromManager()
        }
    }

    const playerFlightBulletCheckShape = new ColliderBox(v1.set(1,1))

    export class EnemyBullet extends Bullet {
        readonly isEnemyBullet = true
        protected canHitPlayer = true

        shouldCollidePlayerBullet: (b: PlayerBullet )=>boolean = b=>b.cancelEnemyBullet
        onCollidePlayerBullet?: (b: PlayerBullet, hitPos: Vector2 )=>void = (b, hitPos)=>{
            this.onHitPlayer()
            b.onHitEnemy(hitPos)
        }

        constructor(
            stage: Stage,
            direction: Vector2,
            readonly shooter: EnemyFlight,
            speed = Constant.bulletSpeed*0.5
        ){
            super( stage, "white" )
            this.velocity.copy(direction).multiply(speed)
        }

        protected onHitPlayer(){
            this.removeFromManager()
        }

        protected collidePlayerBullet(){
            if( this.manager &&
                this.onCollidePlayerBullet &&
                this.shouldCollidePlayerBullet
            ){
                for( let b of this.manager.playerBullets ){
                    if( this.shouldCollidePlayerBullet(b) &&
                        CollisionChecker.intersect(
                        this.collisionShape,
                        this.pos,
                        b.collisionShape,
                        b.pos,
                        v1 )
                    ){
                        this.onCollidePlayerBullet(b, v1)
                        break
                    }
                }
            }
        }

        private hitPlayer(){
            if( this.manager && this.canHitPlayer ){
                for( let playerFlight of this.manager.playerFlights ){
                    if( playerFlight.invincibleTime<=0 ){
                        for( let i=0; i<playerFlight.flightUnits.length; i++ ){
                            const u = playerFlight.flightUnits[i]
                            if( u.powered ){
                                if(
                                    CollisionChecker.intersect(
                                        this.collisionShape,
                                        this.pos,
                                        u.collisionShape,
                                        v1.add(playerFlight.pos, u.pos),
                                        v2   
                                    )
                                ){
                                    this.onHitPlayer()
                                    break
                                }
                            }else{
                                if(
                                    CollisionChecker.intersect(
                                        this.collisionShape,
                                        this.pos,
                                        playerFlightBulletCheckShape,
                                        v1.add(playerFlight.pos, u.pos),
                                        v2   
                                    )
                                ){
                                    this.shooter.onHitPlayer(playerFlight, i, this.manager)
                                    this.onHitPlayer()
                                    break
                                }
                            }
                        }
                    }
                    if(!this.manager)break
                }
            }
        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            this.collidePlayerBullet()
            this.hitPlayer()            
        }
    }
}