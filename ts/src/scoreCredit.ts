namespace zlsSpaceInvader {

    export function addLeadingZero( n: number, length: number ){
        let s = `${n}`
        while( s.length<length ){
            s = "0"+s
        }
        return s
    }

    const hiScoreItemKey = "hiscore"

    export class ScoreAndCredit extends GameObject {

        private _score = 0
        get score(){
            return this._score
        }
        set score( n: number ){
            this._score = n
            this.updateHiScore(n)
            if( this._score>this.nextCredit ){
                this.credit += 1
                this.nextCredit += 10000
            }
        }
        private _hiScore = parseInt(localStorage.getItem(hiScoreItemKey) || "0")
        get hiScore(){
            return this._hiScore
        }
        credit = 0
        private nextCredit = 10000

        constructor( 
            readonly stage: Stage,
            readonly franchouchou: {
                remainingMember: number
            }
        ){
            super()
            this.renderOrder = 1
            this.renderHalf = false
        }

        updateHiScore( score: number ){
            if( score>this.hiScore ){                    
                this._hiScore = score
                localStorage.setItem(hiScoreItemKey,`${this._hiScore}`)
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime,ctx)

            const w = this.stage.right-this.stage.left
            const h = this.stage.bottom-this.stage.top

            TextDrawer.shared.drawText(`SCORE ${addLeadingZero(this.score,6)}`, Math.floor(-w/2+4), Math.floor(-h/2+9), ctx )

            const hiScoreTxt = `HI-SCORE ${addLeadingZero(this.hiScore,6)}`
            TextDrawer.shared.drawText(hiScoreTxt,Math.floor(w/2-2-TextDrawer.shared.measure(hiScoreTxt)), Math.floor(-h/2+9),ctx)

            const creditTxt = `CREDIT ${addLeadingZero(Math.min(this.credit,99),2)}`
            TextDrawer.shared.drawText(creditTxt, Math.floor(w/2-2-TextDrawer.shared.measure(creditTxt)), Math.floor(h/2-10), ctx )

            TextDrawer.shared.drawText(`${this.franchouchou.remainingMember}`, Math.floor(-w/2+4), Math.floor(h/2-10), ctx )
        }

    }

}