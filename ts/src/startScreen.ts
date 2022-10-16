namespace zlsSpaceInvader {

    export class StartScreen extends GameObject {

        private time = 0

        constructor(
            readonly onStart: ()=>void
        ){
            super()
            this.renderOrder = 1
        }

        update(deltaTime: number): void {
            super.update( deltaTime )
            
            this.time += deltaTime

            if( Input.shared.pressAnyKey && this.time>=1 ){
                this.onStart()
                this.removeFromManager()
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            const txt = `PRESS ANY KEY TO START`
            TextDrawer.shared.drawText( txt, Math.floor(-TextDrawer.shared.measure(txt)/2), 30, ctx)
        }
    }

}