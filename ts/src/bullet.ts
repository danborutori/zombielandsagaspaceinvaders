namespace zlsSpaceInvader {

    const v1 = new Vector2
    const v2 = new Vector2
    const v3 = new Vector2

    const collisioShape = new ColliderBox(v1.set(1,3))

    function drawLine(
        from: Vector2,
        to: Vector2,
        ctx: CanvasRenderingContext2D
    ){
        const dir = v1.sub(to, from )
        const dist = Math.round(dir.length())
        dir.normalize()
        const pt = v2.copy(from)

        for( let i=0; i<dist; i++ ){
            ctx.fillRect(
                Math.floor(pt.x),
                Math.floor(pt.y),
                1,1)
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

        update(deltaTime: number): void {
            super.update(deltaTime)

            this.pos.addScaled(this.velocity,deltaTime)
            if( this.pos.y<=this.stage.top ||
                this.pos.y>=this.stage.bottom
            ){
                this.removeFromManager()
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime, ctx)
            ctx.fillStyle = this.color
            v1.copy(this.velocity).normalize()
            drawLine( 
                v2.copy(this.pos).floor().addScaled(v1,1.5),
                v3.copy(this.pos).floor().addScaled(v1,-1.5),
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

        constructor(
            stage: Stage,
            color: string
        ){
            super( stage, color )
            this.velocity.set(0, -Constant.bulletSpeed )
        }

        spark(){
            if( this.manager ){
                const s = new PlayerBulletSpark(this.color)
                s.pos.copy(this.pos)
                this.manager.add(s)
            }
        }
    }

    const playerFlightBulletCheckShape = new ColliderBox(v1.set(1,1))

    export class EnemyBullet extends Bullet {
        readonly isEnemyBullet = true
        protected canHitPlayer = true

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

        update(deltaTime: number): void {
            super.update(deltaTime)

            if( this.manager && this.canHitPlayer ){
                for( let playerFlight of this.manager.playerFlights ){
                    if( playerFlight.invincibleTime<=0 ){
                        for( let i=0; i<playerFlight.flightUnits.length; i++ ){
                            const u = playerFlight.flightUnits[i]
                            if(
                                CollisionChecker.intersect(
                                    this.collisionShape,
                                    this.pos,
                                    playerFlightBulletCheckShape,
                                    v1.add(playerFlight.pos, u.pos)    
                                )
                            ){
                                this.shooter.onHitPlayer(playerFlight, i, this.manager)
                                this.onHitPlayer()
                                break
                            }
                        }
                    }
                    if(!this.manager)break
                }
            }
        }
    }
}