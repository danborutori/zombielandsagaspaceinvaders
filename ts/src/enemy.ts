namespace zlsSpaceInvader {

    const enemySize = 9

    export class EnemyFlight extends SpriteObject {

        private flashTime = 0
        private origSprite: HTMLImageElement
        private flashingSprite: HTMLCanvasElement
        private hp = 3

        constructor(
            sprite: HTMLImageElement,
            readonly scorer: ScoreAndCredit,
            readonly score: number = 100
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
                    if( b.pos.distance( this.pos )<enemySize ){
                        this.flashTime = 0.1
                        this.manager.remove(b)
                        this.hp -= 1
                        if( this.hp<=0 ){
                            const ex = new Explosion
                            ex.pos.copy(this.pos)
                            this.manager.add(ex)
                            this.manager.remove(this)
                            this.scorer.score += this.score
                        }
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
            scorer: ScoreAndCredit
        ){
            super( Sprites.shared.images["zombie1"], scorer, 100)
        }

    }

    export class Zombie2 extends EnemyFlight {

        constructor(
            scorer: ScoreAndCredit
        ){
            super( Sprites.shared.images["zombie2"], scorer, 100)
        }

    }

    export class Hand extends EnemyFlight {

        constructor(
            scorer: ScoreAndCredit
        ){
            super( Sprites.shared.images["hand"], scorer, 100)
        }

    }

    export class Dog extends EnemyFlight {

        constructor(
            scorer: ScoreAndCredit
        ){
            super( Sprites.shared.images["dog"], scorer, 100)
        }

    }

    export class Producer extends EnemyFlight {

        constructor(
            scorer: ScoreAndCredit
        ){
            super( Sprites.shared.images["p"], scorer, 1000)
        }

    }
}