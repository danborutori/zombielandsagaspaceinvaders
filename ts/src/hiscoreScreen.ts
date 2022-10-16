namespace zlsSpaceInvader {

    export class HiScoreScreen extends GameObject {

        private time = 0

        constructor(
            readonly score: number
        ){
            super()
            this.renderOrder = 1
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

            const txt = `HI-SCORE ${addLeadingZero(this.score, 6)}`
            TextDrawer.shared.drawText( txt, Math.floor(-TextDrawer.shared.measure(txt)/2), -2, ctx)
        }
    }

}