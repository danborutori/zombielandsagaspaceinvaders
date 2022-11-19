namespace zlsSpaceInvader {

    const w = 12
    const h = 9
    const characterSpacing = 10

    const characters: {[s: string]: {
        x: number
        y: number
    }} = {}

    for( let i=0; i<10; i++ ){
        characters[`${i}`] = {
            x: 26+i*w,
            y: 46
        }
    }

    const letters1 = "ABCDEFGHIJKLMNO"
    const letters2 = "PQRSTUVWXYZ"
    for( let i=0; i<letters1.length; i++ ){
        characters[letters1[i]] = {
            x: 38+i*w,
            y: 55
        }
    }
    for( let i=0; i<letters2.length; i++ ){
        characters[letters2[i]] = {
            x: 26+i*w,
            y: 64
        }
    }

    characters["_"] = {
        x: 98,
        y: 28
    }

    characters["←"] = {
        x: 158,
        y: 28
    }

    characters["-"] = {
        x: 182,
        y: 37
    }

    characters["?"] = {
        x: 206,
        y: 46
    }

    characters["ジ"] = {
        x: 182,
        y: 154
    }

    characters["ャ"] = {
        x: 194,
        y: 154
    }

    characters["イ"] = {
        x: 206,
        y: 154
    }

    export class TextDrawer {
        static readonly shared = new TextDrawer()

        private fontSheet = Sprites.shared.images["font"]
        private outlineFontSheet!: HTMLCanvasElement

        private initOutline(){
            if(!this.outlineFontSheet){
                this.outlineFontSheet = document.createElement("canvas")
                this.outlineFontSheet.width = this.fontSheet.width
                this.outlineFontSheet.height = this.fontSheet.height
                const ctx = this.outlineFontSheet.getContext("2d")!
                ctx.translate(1,1)
                ctx.drawImage( this.fontSheet, 1, 0)
                ctx.drawImage( this.fontSheet, 0, 1)
                ctx.drawImage( this.fontSheet, -1, 0)
                ctx.drawImage( this.fontSheet, 0, -1)
                ctx.drawImage( this.fontSheet, 1, 1)
                ctx.drawImage( this.fontSheet, -1, -1)
                ctx.drawImage( this.fontSheet, 1, -1)
                ctx.drawImage( this.fontSheet, -1, 1)
                ctx.fillStyle = "black"
                ctx.globalCompositeOperation = "source-in"
                ctx.fillRect(0,0,this.outlineFontSheet.width,this.outlineFontSheet.height)
                ctx.globalCompositeOperation = "source-over"
                ctx.drawImage( this.fontSheet, 0, 0)
            }
        }

        measure( text: string ){
            return text.length*characterSpacing*0.5
        }

        drawText( text: string, x: number, y: number, ctx: CanvasRenderingContext2D ){
            this._drawText( text, x, y, ctx, this.fontSheet)
        }

        drawTextOutline( text: string, x: number, y: number, ctx: CanvasRenderingContext2D ){
            this.initOutline()
            this._drawText( text, x, y, ctx, this.outlineFontSheet)
        }

        drawTextCenteredOutline( text: string, x: number, y: number, ctx: CanvasRenderingContext2D ){
            this.initOutline()
            this._drawText( text, x-this.measure(text)/2, y, ctx, this.outlineFontSheet)
        }

        private _drawText( text: string, x: number, y: number, ctx: CanvasRenderingContext2D, fontSheet: HTMLImageElement | HTMLCanvasElement ){
            ctx.save()
            ctx.translate(x, y)
            ctx.scale(0.5,0.5)
            for( let c of text ){
                const m = characters[c]
                if( m ){
                    ctx.drawImage(
                        fontSheet,
                        m.x, m.y,w, h,
                        0, 0, w, h
                    )
                }
                ctx.translate(characterSpacing, 0)
            }
            ctx.restore()
        }
    }

}