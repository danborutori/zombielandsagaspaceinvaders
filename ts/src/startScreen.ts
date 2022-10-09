namespace zlsSpaceInvader {

    export class StartScreen extends GameObject {

        private time = 0

        constructor(
            readonly onStart: ()=>void
        ){
            super()
        }

        update(deltaTime: number): void {
            super.update( deltaTime )
            
            this.time += deltaTime

            if( Input.shared.pressAnyKey && this.time>=1 ){
                this.onStart()
                this.manager && this.manager.remove(this)
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            const txt = `P R E S S   A N Y   K E Y   T O   S T A R T`
            ctx.font = Palette.font
            ctx.fillStyle = "white"
            ctx.fillText( txt, Math.floor(-ctx.measureText(txt).width/2), 30)
        }
    }

}