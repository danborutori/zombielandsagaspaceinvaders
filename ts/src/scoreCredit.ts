namespace zlsSpaceInvader {

    function addLeadingZero( n: number, length: number ){
        let s = `${n}`
        while( s.length<length ){
            s = "0"+s
        }
        return s.split("").join(" ")
    }

    export class ScoreAndCredit extends GameObject {

        score = 0
        hiScore = 0
        credit = 0

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime,ctx)

            const w = ctx.canvas.width
            const h = ctx.canvas.height

            ctx.font = "7px Trebuchet MS"
            ctx.fillStyle = "white"
            ctx.fillText(`S C O R E   ${addLeadingZero(this.score,6)}`, Math.floor(-w/2+4), Math.floor(-h/2+9) )

            const hiScoreTxt = `H I - S C O R E   ${addLeadingZero(this.hiScore,6)}`
            ctx.fillText(hiScoreTxt, Math.floor(w/2-4-ctx.measureText(hiScoreTxt).width), Math.floor(-h/2+9) )

            const creditTxt = `C R E D I T   ${addLeadingZero(this.credit,2)}`
            ctx.fillText(creditTxt, Math.floor(w/2-4-ctx.measureText(creditTxt).width), Math.floor(h/2-6) )

            ctx.fillText("7", Math.floor(-w/2+4), Math.floor(h/2-6) )
        }

    }

}