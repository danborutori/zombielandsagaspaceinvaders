namespace zlsSpaceInvader {

    const starDensity = 0.0025

    type SkyState = "battle" | "starSky" | "burning" | "whiteout" | "bluesky"

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
            let srcH = this.h
            const srcS = this.s
            const srcL = this.l

            const dh = h-srcH
            if( dh>180 ){
                h -= 360
            }else if( dh<-180 ){
                srcH -= 360
            }

            const timeStep = 0.1
            let time = 0

            while( time<duration && seq==this.setSeq){
                await wait( timeStep )
                time += timeStep

                const a = Math.min(1,time/duration)

                this.h = mix( srcH, h, a )
                if( this.h<0 ) this.h += 360
                this.s = mix( srcS, s, a )
                this.l = mix( srcL, l, a )
            }
        }

        get style() {
            return `hsl(${Math.floor(this.h)},${Math.floor(this.s)}%,${Math.floor(this.l)}%)`
        }
    }

    const cloudSprites = [
        Sprites.shared.images.cloud0,
        Sprites.shared.images.cloud1,
        Sprites.shared.images.cloud2,
        Sprites.shared.images.cloud3,
    ]

    class Cloud extends SpriteObject {

        private velocity = new Vector2()
        private time = 0

        constructor(){
            super( cloudSprites[Math.floor(Math.random()*4)] )
            this.velocity.set(0, 100+Math.random()*200)
        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            this.time += deltaTime

            this.pos.addScaled( this.velocity, deltaTime )

            if( this.time>=5 ){
                this.removeFromManager()
            }
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

        private bgColor = new Color( 346, 30, 8 )
        // private targetBgColor

        private stars: {
            color: Color
            pos: Vector2
            speed: number
            height: number
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
                    color: new Color( 343, 67, 27),
                    pos: new Vector2(
                        stage.left+Math.random()*w,
                        stage.top+Math.random()*h
                    ),
                    speed: (10+Math.random()*10)*0.6,
                    height: 1
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
                ctx.fillRect(Math.floor(s.pos.x), Math.floor(s.pos.y), 1, s.height)
            }
        }

        private onStateChanged(){
            switch( this.state ){
            case "starSky":
                this.bgColor.set(
                    this.bgColor.h,
                    this.bgColor.s,
                    0,
                    5
                )
                for( let s of this.stars ){
                    s.color.set(
                        Math.floor(Math.random()*360),
                        s.color.s,
                        Math.floor(27+Math.random()*73),
                        5
                    )
                }
                break
            case "burning":
                this.bgColor.set(
                    4,
                    89,
                    46,
                    2
                )
                for( let s of this.stars ){
                    s.color.set(
                        55,
                        73,
                        50,
                        2
                    )
                    s.speed *= 20
                }
                break
            case "whiteout":
                this.bgColor.set(
                    4,
                    89,
                    100,
                    0.3
                )
                for( let s of this.stars ){
                    s.color.set(
                        55,
                        73,
                        100,
                        0.3
                    )
                }
                break
            case "bluesky":
                this.bgColor.set(
                    214,
                    67,
                    42,
                    2
                )
                for( let s of this.stars ){
                    s.color.set(
                        211,
                        72,
                        48,
                        2
                    )
                    s.height = 3
                }
                if( this.manager ){
                    for( let i=0; i<50; i++ ){
                        const cloud = new Cloud()
                        cloud.pos.set(
                            this.stage.left+Math.random()*(this.stage.right-this.stage.left),
                            this.stage.bottom-Math.random()*(this.stage.bottom-this.stage.top+100)
                        )
                        this.manager.add(cloud)
                    }
                }
                break
            }
        }
    }

}