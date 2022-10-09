namespace zlsSpaceInvader {

    const starDensity = 0.0025

    export class StarNight extends GameObject {

        private stars: {
            pos: Vector2
            speed: number
        }[]

        constructor(
            readonly stage: Stage
        ){
            super()

            const w = stage.right-stage.left
            const h = stage.bottom-stage.up

            this.stars = new Array( Math.floor(w*h*starDensity) )
            for( let i=0; i<this.stars.length; i++ ){
                this.stars[i] = {
                    pos: new Vector2(
                        stage.left+Math.random()*w,
                        stage.up+Math.random()*h
                    ),
                    speed: 10+Math.random()*10
                }
            }
        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            const h = this.stage.bottom-this.stage.up

            for( let s of this.stars ){
                s.pos.y += s.speed*deltaTime
                if( s.pos.y>this.stage.bottom )
                    s.pos.y -= h
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime, ctx)

            const sprite = Sprites.shared.images["star"]

            for( let s of this.stars ){
                ctx.drawImage(
                    sprite,
                    Math.floor(s.pos.x),
                    Math.floor(s.pos.y)
                )
            }
        }

    }

}