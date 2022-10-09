namespace zlsSpaceInvader {

    export class ScoreAndCredit extends GameObject {



        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime,ctx)

            const w = ctx.canvas.width
            const h = ctx.canvas.height

            ctx.font = "7px Trebuchet MS"
            ctx.fillStyle = "white"
            ctx.fillText("S C O R E   0 0 0 0 0 0", Math.floor(-w/2+4), Math.floor(-h/2+9) )

            const hiScoreTxt = "H I - S C O R E   9 9 9 9 9 9"            
            ctx.fillText(hiScoreTxt, Math.floor(w/2-4-ctx.measureText(hiScoreTxt).width), Math.floor(-h/2+9) )

            const creditTxt = "C R E D I T   0 0"
            ctx.fillText(creditTxt, Math.floor(w/2-4-ctx.measureText(creditTxt).width), Math.floor(h/2-6) )

            ctx.fillText("7", Math.floor(-w/2+4), Math.floor(h/2-6) )
        }

    }

}