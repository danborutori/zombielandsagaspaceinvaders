namespace zlsSpaceInvader {

    export class FloatingText extends GameObject {

        private time = 0

        constructor(
            readonly text: string
        ){
            super()
        }

        update( deltaTime: number ){
            super.update( deltaTime )

            this.time += deltaTime

            if( this.time>3 ){
                this.removeFromManager()
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            ctx.font = Palette.font
            ctx.fillStyle = "white"
            ctx.fillText(
                this.text,
                Math.floor(this.pos.x-ctx.measureText(this.text).width/2),
                Math.floor(this.pos.y)
            )
        }

    }

}