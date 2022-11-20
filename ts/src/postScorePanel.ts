namespace zlsSpaceInvader {

    const v1 = new Vector2
    const v2 = new Vector2

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

        private time = 0

        constructor(){
            super()
            this.renderHalf = false
        }

        update(deltaTime: number): void {
            super.update( deltaTime )

            this.time += deltaTime
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            ctx.save()
            ctx.translate(0,-50)
            TextDrawer.shared.drawTextCenteredOutline("TAP TO ENTER YOU INITIAL:", 0, 0, ctx)
            ctx.scale(2,2)
            const displayInitial = Array.from(this.initial)
            if( Math.floor(this.time/0.1)%2==0 &&
                this.inputIndex<displayInitial.length
            )
                displayInitial[this.inputIndex] = " "
            TextDrawer.shared.drawTextCenteredOutline(displayInitial.join(), 0, 7, ctx)
            for( let i=0; i<keys.length; i++ ){
                TextDrawer.shared.drawTextCenteredOutline(keys[i].split("").join(" "), 0, 21+i*7, ctx)    
            }
            ctx.restore()
        }

        private registerPointerEvent(
            canvas: HTMLCanvasElement
        ){
            const listener = (x: number, y: number)=>{
                let pressedCharacter: string | undefined
                v1.set(
                    x - 117,
                    y - 347
                ).divide(
                    v2.set(80, 56)
                ).add(0.5).floor()
                const s = keys[v1.y] 
                if( s ){
                    pressedCharacter = s[v1.x]
                }

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
            const pointerListener = (e: PointerEvent)=>{
                listener( e.offsetX, e.offsetY )
            }
            const touchListener = (e: TouchEvent)=>{
                const b = canvas.getBoundingClientRect()
                const scale = 1/(document.body.style as any).zoom
                listener(
                    (e.touches[0].pageX-b.left)*scale,
                    (e.touches[0].pageY-b.top)*scale
                )
            }
            canvas.addEventListener("pointerdown", pointerListener)
            canvas.addEventListener("touchstart", touchListener)

            return {
                unregister: ()=>{
                    canvas.removeEventListener("pointerdown", pointerListener)
                    canvas.removeEventListener("touchstart", touchListener)
                }
            }
        }

        async postScore(
            scorer: ScoreAndCredit,
            wave: number,
            canvas: HTMLCanvasElement
        ){

            const records = await Leaderboard.shared.getRecords()
            const canPostScore = records.length<8 || scorer.score>=records[7].score

            if( canPostScore ){

                const eventCtx = this.registerPointerEvent(canvas)

                try{

                    while( this.inputIndex<this.initial.length ){
                        await this.wait(0)
                    }

                    const int = this.initial.join("")

                    await Leaderboard.shared.post(int,scorer.score,wave,generateUUID())

                }catch(e){
                    // do nothing
                }finally{
                    eventCtx.unregister()
                    this.removeFromManager()
                }

            }

        }
    }

}