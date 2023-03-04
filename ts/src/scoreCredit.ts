namespace zlsSpaceInvader {

    const difficultyTitle: {[name in Difficulty]: string} = {
        easy: "EASY",
        normal: "NORMAL"
    }

    export function addLeadingZero( n: number, length: number ){
        let s = `${n}`
        while( s.length<length ){
            s = "0"+s
        }
        return s
    }

    const hiScoreItemKey = {
        easy: "hiscore.easy",
        normal: "hiscore"
    }
    export const highestScoreDisplay = 999999

    export class ScoreAndCredit extends GameObject {

        private _score = 0
        get score(){
            return this._score
        }
        set score( n: number ){
            this._score = n
            this.updateHiScore(n, DifficultyManager.shared.difficulty)
            if( this._score>this.nextCredit ){
                this.credit += 1
                Audio.play(Audio.sounds.credit)
                this.nextCredit += 10000
            }
        }
        private _hiScore = {
            easy: parseInt(localStorage.getItem(hiScoreItemKey.easy) || "0"),
            normal: parseInt(localStorage.getItem(hiScoreItemKey.normal) || "0")
        }
        private get hiScore(){
            return this._hiScore
        }
        credit = 0
        nextCredit = 10000

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

        updateHiScore( score: number, difficulty: Difficulty ){
            if( score>this.hiScore[difficulty] ){
                this._hiScore[difficulty] = score
                localStorage.setItem(hiScoreItemKey[difficulty],`${this._hiScore[difficulty]}`)
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime,ctx)

            const w = this.stage.right-this.stage.left
            const h = this.stage.bottom-this.stage.top

            TextDrawer.shared.drawText(`SCORE ${addLeadingZero(Math.min(highestScoreDisplay,this.score),6)}`, Math.floor(-w/2+4), Math.floor(-h/2+9), ctx )

            const hiScoreTxt = `HI-SCORE ${addLeadingZero(Math.min(highestScoreDisplay,this.hiScore[DifficultyManager.shared.difficulty]),6)}`
            TextDrawer.shared.drawText(hiScoreTxt,Math.floor(w/2-2-TextDrawer.shared.measure(hiScoreTxt)), Math.floor(-h/2+9),ctx)

            const diffTxt = difficultyTitle[DifficultyManager.shared.difficulty]
            TextDrawer.shared.drawText(diffTxt,Math.floor(w/2-2-TextDrawer.shared.measure(diffTxt)), Math.floor(-h/2+2),ctx)

            const creditTxt = `CREDIT ${addLeadingZero(Math.min(this.credit,99),2)}`
            TextDrawer.shared.drawText(creditTxt, Math.floor(w/2-2-TextDrawer.shared.measure(creditTxt)), Math.floor(h/2-10), ctx )

            TextDrawer.shared.drawText(`${this.franchouchou.remainingMember}`, Math.floor(-w/2+4), Math.floor(h/2-10), ctx )
        }

    }

}