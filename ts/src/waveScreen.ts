namespace zlsSpaceInvader {

    export class WaveScreen extends GameObject {

        private time = 0

        constructor(
            readonly wave: number,
            readonly onEnd: ()=>void
        ){
            super()
        }

        update(deltaTime: number): void {
            super.update( deltaTime )
            
            this.time += deltaTime

            if( this.time>=3 ){
                this.onEnd()
                this.removeFromManager()
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            const txt = `W A V E   ${addLeadingZero(this.wave, 2)}`
            ctx.font = Palette.font
            ctx.fillStyle = "white"
            ctx.fillText( txt, Math.floor(-ctx.measureText(txt).width/2), 30)
        }
    }

}