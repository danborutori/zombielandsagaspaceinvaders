namespace zlsSpaceInvader {

    

    export class VideoNoise extends GameObject {

        private time = 0

        strength = 1

        update( deltaTime: number ){
            super.update( deltaTime )
            this.time += deltaTime
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {

            const offScreenCanvas = document.createElement("canvas")

            const scale = 1/(1+this.strength*7)

            offScreenCanvas.width = Math.floor(ctx.canvas.width*scale)
            offScreenCanvas.height = Math.floor(ctx.canvas.height*scale)
            
            const offScrCtx = offScreenCanvas.getContext("2d")!
            offScrCtx.imageSmoothingEnabled = false
            offScrCtx.drawImage(ctx.canvas,0,0,ctx.canvas.width,ctx.canvas.height,0,0,offScreenCanvas.width,offScreenCanvas.height)

            ctx.save()
            ctx.resetTransform()
            ctx.filter = `saturate(${Math.floor((1-this.strength)*100)}%) hue-rotate(${Math.floor(this.strength*180)}deg) contrast(${Math.floor((1+this.strength)*100)}%)`
            ctx.drawImage(offScreenCanvas,0,0,offScreenCanvas.width,offScreenCanvas.height,0,0,ctx.canvas.width,ctx.canvas.height)
            ctx.restore()

        }

    }

}