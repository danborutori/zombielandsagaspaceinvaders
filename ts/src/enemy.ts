namespace zlsSpaceInvader {

    const v = new Vector2

    export class EnemyFlight extends SpriteObject {

        private flashTime = 0
        private origSprite: HTMLImageElement
        private flashingSprite: HTMLCanvasElement
        private hp = 3
        vel = new Vector2

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

        update(deltaTime: number): void {
            super.update(deltaTime)

            this.pos.add( this.vel )

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

                const playerFlight = this.manager && this.manager.gameObjects.filter(o=>(o as PlayerFlight).isPlayerFlight)[0]
                if( playerFlight ){
                    v.sub(this.pos, playerFlight.pos).abs()
                    if( 
                        v.x<9 &&
                        v.y<9
                    ){
                        this.onHitPlayer(this,playerFlight as PlayerFlight)
                    }
                }
            }
        }


        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime,ctx)
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