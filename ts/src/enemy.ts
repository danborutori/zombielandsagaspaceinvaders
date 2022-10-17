namespace zlsSpaceInvader {

    const v = new Vector2

    export class EnemyFlight extends SpriteObject {

        private flashTime = 0
        private origSprite: HTMLImageElement
        private flashingSprite: HTMLCanvasElement
        private hp = 3
        readonly vel = new Vector2
        private flyOff?: EnemyFlyOff
        rotate = 0

        constructor(
            sprite: HTMLImageElement,
            readonly scorer: ScoreAndCredit,
            readonly score: number = 100,
            readonly onHitPlayer: (e:EnemyFlight, p:PlayerFlight)=>void
        ){
            super(sprite)

            this.origSprite = sprite
            this.flashingSprite = document.createElement("canvas")
            this.flashingSprite.width = sprite.width
            this.flashingSprite.height = sprite.height
            const ctx = this.flashingSprite.getContext("2d")!
            ctx.fillStyle = "white"
            ctx.fillRect(0,0,this.flashingSprite.width,this.flashingSprite.height)
            ctx.globalCompositeOperation ="destination-in"
            ctx.drawImage( sprite, 0, 0 )
        }

        startFlyOff( regroupPos: Vector2 ){
            if( !this.flyOff ){
                this.flyOff = new EnemyFlyOff(this, regroupPos )
            }
        }

        get isFlyingOff(){
            return this.flyOff!==undefined
        }

        endFlyOff(){
            this.flyOff = undefined
            this.vel.set(0,0)
        }

        private wrapAround(){
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

            if( this.manager ){
                const bs = this.manager.gameObjects.filter(b=>(b as Bullet).isBullet)
                for( let b of bs ){
                    v.sub(this.pos, b.pos).abs()
                    if( v.x<5 &&
                        v.y<5.5
                    ){
                        this.flashTime = 0.1
                        b.removeFromManager()
                        this.hp -= 1
                        if( this.hp<=0 ){
                            const ex = new Explosion
                            ex.pos.copy(this.pos)
                            this.manager.add(ex)
                            this.removeFromManager()
                            this.scorer.score += this.score
                        }
                    }
                }

                const playerFlight = this.manager && this.manager.gameObjects.filter(o=>(o as PlayerFlight).isPlayerFlight)[0] as PlayerFlight
                if( playerFlight ){
                    if( this.flyOff ){
                        this.flyOff.update( deltaTime, playerFlight )
                    }else{
                        this.rotate -= Math.sign(this.rotate)*Math.min(Math.abs(this.rotate),deltaTime*Math.PI*2)
                    }

                    v.sub(this.pos, playerFlight.pos).abs()
                    if( 
                        v.x<9 &&
                        v.y<9 &&
                        playerFlight.invincibleTime<=0
                    ){
                        this.onHitPlayer(this,playerFlight as PlayerFlight)
                    }
                }
            }
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

    export class Zombie1 extends EnemyFlight {

        constructor(
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight)=>void
        ){
            super(
                Sprites.shared.images["zombie1"],
                scorer,
                100,
                onHitPlayer
            )
        }

    }

    export class Zombie2 extends EnemyFlight {

        constructor(
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight)=>void
        ){
            super(
                Sprites.shared.images["zombie2"],
                scorer,
                100,
                onHitPlayer
            )
        }

    }

    export class Hand extends EnemyFlight {

        constructor(
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight)=>void
        ){
            super(
                Sprites.shared.images["hand"],
                scorer,
                100,
                onHitPlayer
            )
        }

    }

    export class Dog extends EnemyFlight {

        constructor(
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight)=>void
        ){
            super(
                Sprites.shared.images["dog"],
                scorer,
                100,
                onHitPlayer
            )
        }

    }

    export class Producer extends EnemyFlight {

        constructor(
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight)=>void
        ){
            super(
                Sprites.shared.images["p"],
                scorer,
                1000,
                onHitPlayer
            )
        }

    }
}