namespace zlsSpaceInvader {

    export class StartScreen extends GameObject {

        private time = 0

        readonly leaderboard = new LeaderboardScreen()

        constructor(
            readonly onStart: ()=>void
        ){
            super()
            this.renderOrder = 1
            this.renderHalf = false
        }

        update(deltaTime: number): void {
            super.update( deltaTime )
            
            this.time += deltaTime

            if( Input.shared.pressAnyKey && this.time>=1 ){
                this.onStart()
                this.removeFromManager()                
                this.leaderboard.removeFromManager()
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            const txt = `PRESS ANY KEY TO START`
            TextDrawer.shared.drawText( txt, Math.floor(-TextDrawer.shared.measure(txt)/2), 30, ctx)
        }
    }

}