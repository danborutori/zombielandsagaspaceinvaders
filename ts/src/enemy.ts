namespace zlsSpaceInvader {

    const v = new Vector2

    const collisioBox = new ColliderBox(v.set(9,9))

    export class EnemyFlight extends SpriteObject {

        private flashTime = 0
        private origSprite: HTMLImageElement
        private flashingSprite: HTMLCanvasElement
        readonly vel = new Vector2
        protected flyOff?: EnemyFlyOff<EnemyFlight>
        rotate = 0
        invincible = false
        bulletCountDelta = 0
        bulletIntervalScale = 1
        bulletShootAngle = 5*Math.PI/180
        homingTime = 2
        protected collisionShape: ColliderShape = collisioBox

        constructor(
            sprite: HTMLImageElement,
            readonly scorer: ScoreAndCredit,
            readonly score: number = 100,
            protected hp: number
        ){
            super(sprite)

            this.origSprite = sprite
            this.flashingSprite = ColoredSprite.shared.get("white", sprite)
        }

        startFlyOff(
            cooperator: EnemyCooperator,
            regroupPos: Vector2,
            shootInterval: number,
            bulletCount: number
        ){
            if( !this.flyOff ){
                this.flyOff = new EnemyFlyOff(
                    this,
                    regroupPos,
                    shootInterval,
                    bulletCount
                )
            }
        }

        get isFlyingOff(){
            return this.flyOff!==undefined
        }

        endFlyOff(){
            this.flyOff = undefined
            this.vel.set(0,0)
        }

        protected wrapAround(){
            const padding = 9
            const w = this.scorer.stage.right-this.scorer.stage.left+padding*2
            const h = this.scorer.stage.bottom-this.scorer.stage.top+padding*2

            while( this.pos.x < this.scorer.stage.left-padding ){
                this.pos.x += w
            }
            while( this.pos.x > this.scorer.stage.right+padding ){
                this.pos.x -= w
            }
            while( this.pos.y < this.scorer.stage.top-padding ){
                this.pos.y += h
                this.flyOff && this.flyOff.onWrapY()
            }
            while( this.pos.y > this.scorer.stage.bottom+padding ){
                this.pos.y -= h
                this.flyOff && this.flyOff.onWrapY()
            }

        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            this.pos.addScaled( this.vel, deltaTime )
            this.wrapAround()

            this.flashTime -= deltaTime
            if( this.flashTime<=0 ){
                this.sprite = this.origSprite
            }else{
                if( Math.floor(this.flashTime/0.03)%2==0 ){
                    this.sprite = this.origSprite
                }else{
                    this.sprite = this.flashingSprite
                }
            }

            this.collidePlayerBullets()
            this.collidePlayerFlight( deltaTime )
        }

        protected bulletFactoty( direction: Vector2 ){
            return new EnemyBullet(
                this.scorer.stage,
                direction,
                this
            )
        }

        shoot( playerFlight: PlayerFlight, phase: number ){
            if( this.manager ){
                v.sub( playerFlight.pos, this.pos ).normalize()
                v.rotateAround( Math.cos(phase*Math.PI*2)*this.bulletShootAngle )
                const b = this.bulletFactoty( v )
                b.pos.copy(this.pos)

                Audio.play(Audio.sounds.enemyShooting)
                
                this.manager.add( b )
            }
        }

        private collidePlayerBullets(){
            if( this.manager &&
                !this.invincible
            ){
                const bs = Array.from(this.manager.playerBullets)
                for( let b of bs ){
                    if( 
                        b.canHit &&
                        CollisionChecker.intersect(
                            this.collisionShape,
                            this.pos,
                            b.collisionShape,
                            b.pos
                        )
                    ){
                        this.flashTime = 0.1
                        b.onHitEnemy()
                        if( this.hp>0 ){
                            this.hp -= b.damage
                            
                            if( this.hp<=0 ){
                                this.onDie()
                            }
                        }
                        this.scorer.score += 1
                    }
                }
            }
        }

        private collidePlayerFlight( deltaTime: number ){
            if( this.manager ){
                for( let playerFlight of Array.from(this.manager.playerFlights)){
                    if( playerFlight ){

                        if( this.flyOff ){
                            this.flyOff.update( deltaTime, playerFlight )
                        }else{
                            this.rotate -= Math.sign(this.rotate)*Math.min(Math.abs(this.rotate),deltaTime*Math.PI*2)
                        }

                        if( playerFlight.invincibleTime<=0 ){
                            for( let i=0; i<playerFlight.flightUnits.length; i++ ){
                                const u = playerFlight.flightUnits[i]
                                if( 
                                    CollisionChecker.intersect(
                                        this.collisionShape,
                                        this.pos,
                                        u.collisionShape,
                                        v.add(playerFlight.pos, u.pos)
                                    )
                                ){
                                    this.onHitPlayer(playerFlight,i,this.manager)
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }

        onHitPlayer( playerFlight: PlayerFlight, unitIndex: number, gameObjectManager: GameObjectManager ){
            const ex = new MemberExplosion()
            ex.pos.add( playerFlight.pos, playerFlight.flightUnits[unitIndex].pos )
            gameObjectManager.add(ex)
            playerFlight.remove(unitIndex )
            Audio.play( Audio.sounds.explosion )
        }

        protected playExplosionAnimation(){
            if( this.manager ){
                const ex = new Explosion
                ex.pos.copy(this.pos)
                this.manager.add(ex)
            }
        }

        protected onDie(){
            this.playExplosionAnimation()
            this.removeFromManager()
            this.flyOff && this.flyOff.onDie()
            this.scorer.score += this.score
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            ctx.save()
            const x = Math.floor(this.pos.x)
            const y = Math.floor(this.pos.y)
            ctx.translate(x, y)
            const rotateStep = Math.PI/8
            ctx.rotate(Math.round(this.rotate/rotateStep)*rotateStep)
            ctx.translate(-x, -y)
            super.render(deltaTime,ctx)
            ctx.restore()
        }
    }
    
}