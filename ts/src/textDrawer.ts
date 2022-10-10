namespace zlsSpaceInvader {

    const w = 12
    const h = 7
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

    characters["-"] = {
        x: 182,
        y: 37
    }

    characters["?"] = {
        x: 206,
        y: 46
    }

    export class TextDrawer {
        static readonly shared = new TextDrawer()

        private fontSheet = Sprites.shared.images["font"]

        measure( text: string ){
            return text.length*characterSpacing*0.5
        }

        drawText( text: string, x: number, y: number, ctx: CanvasRenderingContext2D ){
            ctx.save()
            ctx.translate(x, y)
            ctx.scale(0.5,0.5)
            for( let c of text ){
                const m = characters[c]
                if( m ){
                    ctx.drawImage(
                        this.fontSheet,
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