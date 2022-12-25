namespace zlsSpaceInvader {

    export class BossProgressMeter extends GameObject {

        private progress = 0
        private yellowProgress = 0

        constructor(
            readonly name: string,
            readonly progressFunc: ()=>number
        ){
            super()
            this.renderHalf = false
        }

        update(deltaTime: number): void {
            super.update( deltaTime )
            const d = this.progress-this.yellowProgress
            this.yellowProgress += Math.sign(d)*Math.min(Math.abs(d),deltaTime/20)
            this.progress = this.progressFunc()
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx)

            const w = Sprites.shared.images.bossHpBorder.width

            ctx.save()
            ctx.translate(
                -w/2,
                70
            )

            const hpLen = Math.round((w-4)*(1-this.progress)+2)
            const yHpLen = Math.round((w-4)*(1-this.yellowProgress)+2)

            ctx.drawImage( Sprites.shared.images.bossHpBorder, 0, 0 )
            ctx.drawImage( Sprites.shared.images.bossHpYellow,
                0, 0,
                yHpLen, Sprites.shared.images.bossHpYellow.height,
                0, 0,
                yHpLen, Sprites.shared.images.bossHpYellow.height )
            ctx.drawImage( Sprites.shared.images.bossHp,
                0, 0,
                hpLen, Sprites.shared.images.bossHp.height,
                0, 0,
                hpLen, Sprites.shared.images.bossHp.height )
            TextDrawer.shared.drawTextOutline(this.name,0,-5,ctx)

            ctx.restore()
        }
    }

}