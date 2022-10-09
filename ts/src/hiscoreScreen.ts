namespace zlsSpaceInvader {

    export class HiScoreScreen extends GameObject {

        private time = 0

        constructor(
            readonly score: number
        ){
            super()
        }

        update(deltaTime: number): void {
            super.update( deltaTime )
            
            this.time += deltaTime

            if( Input.shared.pressAnyKey && this.time>=1 ){
                location.reload()
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            const txt = `H I - S C O R E   ${addLeadingZero(this.score, 6)}`
            ctx.font = Palette.font
            ctx.fillStyle = "white"
            ctx.fillText( txt, Math.floor(-ctx.measureText(txt).width/2), 0)
        }
    }

}