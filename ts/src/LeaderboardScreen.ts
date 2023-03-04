namespace zlsSpaceInvader {

    const headline = "- BEST 8 -"
    const columns = "RANK  SCORE WAVE INT"

    export class LeaderboardScreen extends GameObject {

        private records: {[name in Difficulty]: LeaderboardRecord[]} = {
            easy: [],
            normal: []
        }
        private time = 0

        constructor(
            scorer: ScoreAndCredit,
            readonly onKeyPress: ()=>void = ()=>{}
        ){
            super()
            this.renderHalf = false
            this.renderOrder = 1

            Leaderboard.shared.getRecords().then(records=>{
                this.records = records
                for( let d in this.records ){
                    if( this.records[d as Difficulty].length>0 )
                        scorer.updateHiScore(this.records[d as Difficulty][0].score, d as Difficulty)
                }
            }).catch(e=>{
                ErrorHandler.handle(e)
            })
        }

        update(deltaTime: number): void {
            super.update( deltaTime )

            this.time += deltaTime

            if( this.time>=1 && Input.shared.pressAnyKey ){
                this.onKeyPress()
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            ctx.save()
            ctx.translate(0,-50)
            TextDrawer.shared.drawTextOutline(headline, -TextDrawer.shared.measure(headline)/2, 0, ctx)
            TextDrawer.shared.drawTextOutline(columns, -TextDrawer.shared.measure(columns)/2, 7, ctx)
            ctx.translate(0,14)
            const records = this.records[DifficultyManager.shared.difficulty]
            for( let i=0, end=Math.min(8,records.length); i<end; i++ ){
                const r = records[i]
                const rank = i==0?"1ST":i==1?"2ND":i==2?"3RD":`${i+1}TH`
                const txt = ` ${rank} ${addLeadingZero(Math.min(highestScoreDisplay,r.score), 6)}  ${addLeadingZero(r.wave || 0, 3)} ${r.name}`

                TextDrawer.shared.drawTextOutline(txt, -TextDrawer.shared.measure(txt)/2, 0, ctx)
                ctx.translate(0,7)
            }
            ctx.restore()
        }

    }

}