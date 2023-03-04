namespace zlsSpaceInvader {

    const difficultyTitle = {
        normal: "NORMAL",
        easy: "EASY"
    }

    export class StartScreen extends GameObject {

        private time = 0
        readonly leaderboard: LeaderboardScreen

        constructor(
            scorer: ScoreAndCredit,
            readonly onStart: ()=>void
        ){
            super()
            this.leaderboard = new LeaderboardScreen(scorer)
            this.renderOrder = 1
            this.renderHalf = false
        }

        update(deltaTime: number): void {
            super.update( deltaTime )
            
            this.time += deltaTime

            if( Input.shared.leftPressed || Input.shared.rightPressed ){
                switch( DifficultyManager.shared.difficulty ){
                case "normal":
                    DifficultyManager.shared.difficulty = "easy"
                    break
                case "easy":
                    DifficultyManager.shared.difficulty = "normal"
                    break
                }
            }

            if( Input.shared.fire && this.time>=1 ){
                this.onStart()
                this.removeFromManager()                
                this.leaderboard.removeFromManager()
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            if( DifficultyManager.shared.difficulty!="normal" || Math.floor(this.time/0.2)%2==0)
                TextDrawer.shared.drawText( difficultyTitle.normal, Math.floor(-TextDrawer.shared.measure(difficultyTitle.normal))-7, 30, ctx)
            if( DifficultyManager.shared.difficulty!="easy" || Math.floor(this.time/0.2)%2==0)
                TextDrawer.shared.drawText( difficultyTitle.easy, 7, 30, ctx)
        }
    }

}