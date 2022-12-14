namespace zlsSpaceInvader {

    export class FloatingText extends GameObject {

        private time = 0

        constructor(
            readonly text: string,
            readonly onRemove?: ()=>void,
            readonly duration: number = 3
        ){
            super()
            this.renderHalf = false
        }

        update( deltaTime: number ){
            super.update( deltaTime )

            this.time += deltaTime

            if( this.time>this.duration ){
                this.onRemove && this.onRemove()
                this.removeFromManager()
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            TextDrawer.shared.drawText(
                this.text,
                Math.floor(this.pos.x-TextDrawer.shared.measure(this.text)/2),
                Math.floor(this.pos.y),
                ctx
            )
        }

    }

}