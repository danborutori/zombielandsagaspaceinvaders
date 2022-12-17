namespace zlsSpaceInvader {

    const starDensity = 0.0025

    type SkyState = "battle" | "starSky"

    function wait( duration: number ){
        return new Promise(resolve=>{
            setTimeout(resolve,duration*1000)
        })
    }

    class Color {
        constructor(
            public h: number,
            public s: number,
            public l: number
        ){}

        private setSeq = 0
        async set(
            h: number,
            s: number,
            l: number,
            duration: number
        ){
            const seq = ++this.setSeq
            const srcH = this.h
            const srcS = this.s
            const srcL = this.l

            const timeStep = 0.1
            let time = 0

            while( time<duration && seq==this.setSeq){
                await wait( timeStep )
                time += timeStep

                const a = Math.min(1,time/duration)

                this.h = mix( srcH, h, a )
                this.s = mix( srcS, s, a )
                this.l = mix( srcL, l, a )
            }
        }

        get style() {
            return `hsl(${this.h},${this.s}%,${this.l}%)`
        }
    }

    export class StarNight extends GameObject {

        readonly isStarNight = true

        private _state:SkyState = "battle"
        get state() { return this._state }
        set state( s: SkyState ){
            this._state = s
            this.onStateChanged()
        }

        private bgColor = new Color( 346, 30, 17 )
        // private targetBgColor

        private stars: {
            color: Color
            pos: Vector2
            speed: number
        }[]

        constructor(
            readonly stage: Stage
        ){
            super()
            this.renderOrder = -1

            const w = stage.right-stage.left
            const h = stage.bottom-stage.top

            this.stars = new Array( Math.floor(w*h*starDensity) )
            for( let i=0; i<this.stars.length; i++ ){
                this.stars[i] = {
                    color: new Color( 343, 67, 55),
                    pos: new Vector2(
                        stage.left+Math.random()*w,
                        stage.top+Math.random()*h
                    ),
                    speed: (10+Math.random()*10)*0.6
                }
            }
        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            const h = this.stage.bottom-this.stage.top

            for( let s of this.stars ){
                s.pos.y += s.speed*deltaTime
                if( s.pos.y>this.stage.bottom )
                    s.pos.y -= h
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime, ctx)

            const w = ctx.canvas.width
            const h = ctx.canvas.height
            ctx.fillStyle = this.bgColor.style
            ctx.fillRect(-w/2,-h/2,w,h)

            for( let s of this.stars ){
                ctx.fillStyle = s.color.style
                ctx.fillRect(Math.floor(s.pos.x), Math.floor(s.pos.y), 1, 1)
            }
        }

        private onStateChanged(){
            switch( this.state ){
            case "starSky":
                this.bgColor.set(
                    this.bgColor.h,
                    this.bgColor.s,
                    0,
                    3
                )
                for( let s of this.stars ){
                    s.color.set(
                        Math.floor(Math.random()*360),
                        s.color.s,
                        Math.floor(55+Math.random()*46),
                        3
                    )
                }
                break
            }
        }
    }

}