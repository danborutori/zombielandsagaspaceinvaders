namespace zlsSpaceInvader {

    export class Bullet extends GameObject {

        readonly isBullet = true

        constructor(
            readonly stage: Stage,
            readonly color: string
        ){
            super()
        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            this.pos.y -= Constant.bulletSpeed*deltaTime
            if( this.pos.y<=this.stage.top ){
                this.removeFromManager()
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime, ctx)
            ctx.fillStyle = this.color
            ctx.fillRect( Math.floor(this.pos.x-0.5), Math.floor(this.pos.y-1.5), 1, 3 )
        }
    }

}