namespace zlsSpaceInvader {

    function generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    const keys = [
        "ABCDEFG",
        "HIJKLMN",
        "OPQRSTU",
        "VWXYZ ←"
    ]

    export class PostScorePanel extends GameObject {

        private initial = ["_","_","_"]
        private inputIndex = 0
        private selectedIndex = 0
        private pressed = {
            left: false,
            right: false,
            fire: false
        }


        private time = 0
        private canPostScore = false

        constructor(){
            super()
            this.renderHalf = false
        }

        update(deltaTime: number): void {
            super.update( deltaTime )

            this.time += deltaTime

            const totalChar = keys.reduce((a,b)=>a+b.length,0)
            if( Input.shared.left ){
                if( !this.pressed.left ){
                    this.pressed.left = true
                    this.selectedIndex = (this.selectedIndex+totalChar-1)%totalChar
                    if( this.selectedIndex==totalChar-2 )
                        this.selectedIndex--
                }
            }else{
                this.pressed.left = false
            }
            if( Input.shared.right ){
                if( !this.pressed.right ){
                    this.pressed.right = true
                    this.selectedIndex = (this.selectedIndex+1)%totalChar
                    if( this.selectedIndex==totalChar-2 )
                        this.selectedIndex++
                }
            }else{
                this.pressed.right = false
            }
            if( Input.shared.fire ){
                if( !this.pressed.fire ){
                    this.pressed.fire = true
                    const pressedCharacter = keys.join("")[this.selectedIndex]
                    if( pressedCharacter ){
                        switch( pressedCharacter ){
                        case undefined:
                        case " ":
                            break
                        case "←":
                            if( this.inputIndex>0 && this.inputIndex<this.initial.length )
                                this.inputIndex -= 1
                            break
                        default:
                            if( this.inputIndex<this.initial.length ){
                                this.initial[this.inputIndex] = pressedCharacter
                                this.inputIndex++
                            }
                            break
                        }
                    }
                }
            }else{
                this.pressed.fire = false
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            if( this.canPostScore ){
                ctx.save()
                ctx.translate(0,-50)
                TextDrawer.shared.drawTextCenteredOutline("ENTER YOU INITIAL:", 0, 0, ctx)
                ctx.scale(2,2)
                const displayInitial = Array.from(this.initial)
                if( Math.floor(this.time/0.1)%2==0 &&
                    this.inputIndex<displayInitial.length
                )
                    displayInitial[this.inputIndex] = " "
                TextDrawer.shared.drawTextCenteredOutline(displayInitial.join(), 0, 7, ctx)
                ctx.translate(-29,0)
                let cnt = 0
                for( let i=0; i<keys.length; i++ ){
                    const s = keys[i]
                    for( let j=0; j<s.length; j++ ){
                        if( this.selectedIndex!=cnt ||
                            Math.floor(this.time/0.1)%2==0
                        ){
                            TextDrawer.shared.drawTextCenteredOutline(s[j], j*10, 21+i*7, ctx)    
                        }
                        cnt++
                    }
                }
                ctx.restore()
            }
        }

        async postScore(
            scorer: ScoreAndCredit,
            wave: number,
            playerFlight: PlayerFlight
        ){
            this.canPostScore = false
            try{
                const records = (await Leaderboard.shared.getRecords())[DifficultyManager.shared.difficulty]
                this.canPostScore = records.length<8 || scorer.score>=records[7].score
            }catch(e){
                ErrorHandler.handle(e)
            }

            if( this.canPostScore ){

                playerFlight.paused = true

                while( this.inputIndex<this.initial.length ){
                    await this.wait(0)
                }

                playerFlight.paused = false
                
                try{

                    const int = this.initial.join("")
                    await Leaderboard.shared.post(int,scorer.score,wave,generateUUID(), DifficultyManager.shared.difficulty)

                }catch(e){
                    ErrorHandler.handle(e)
                }finally{
                    this.removeFromManager()
                }

            }else{
                this.removeFromManager()
            }

        }
    }

}