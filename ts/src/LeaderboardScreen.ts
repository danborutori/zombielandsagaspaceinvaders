namespace zlsSpaceInvader {

    const headline = "- BEST 8 -"
    const columns = "RANK  SCORE WAVE INT"

    export class LeaderboardScreen extends GameObject {

        private records: LeaderboardRecord[] = []

        constructor(){
            super()
            this.renderHalf = false
            this.renderOrder = 1

            Leaderboard.shared.getRecords().then(records=>{
                this.records = records
            })
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            ctx.save()
            ctx.translate(0,-50)
            TextDrawer.shared.drawTextOutline(headline, -TextDrawer.shared.measure(headline)/2, 0, ctx)
            TextDrawer.shared.drawTextOutline(columns, -TextDrawer.shared.measure(columns)/2, 7, ctx)
            ctx.translate(0,14)
            for( let i=0, end=Math.min(8,this.records.length); i<end; i++ ){
                const r = this.records[i]
                const rank = i==0?"1ST":i==1?"2ND":i==2?"3RD":`${i+1}TH`
                const txt = ` ${rank} ${addLeadingZero(r.score, 6)}  ${addLeadingZero(r.wave || 0, 3)} ${r.name}`

                TextDrawer.shared.drawTextOutline(txt, -TextDrawer.shared.measure(txt)/2, 0, ctx)
                ctx.translate(0,7)
            }
            ctx.restore()
        }

    }

}