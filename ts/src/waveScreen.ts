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

            const txt = `WAVE ${addLeadingZero(this.wave, 2)}`
            TextDrawer.shared.drawText( txt, Math.floor(-TextDrawer.shared.measure(txt)/2), 30, ctx)
        }
    }

}