namespace zlsSpaceInvader {

    export class ContinueScreen extends GameObject {

        private countDown = 9
        private countCoolDown = 1

        constructor(
            readonly continueFunc: (b: boolean)=>void
        ){
            super()
        }

        update( deltaTime: number ){
            super.update( deltaTime )

            if( Input.shared.pressAnyKey && this.countDown<9
            ){
                this.continueFunc( true )
                this.manager && this.manager.remove(this)
            }else{
                this.countCoolDown -= deltaTime
                if( this.countCoolDown<=0 )
                {
                    if( this.countDown <= 0 ){
                        this.continueFunc(false)
                        this.manager && this.manager.remove(this)
                    }else{
                        this.countDown -= 1
                        this.countCoolDown += 1
                    }
                }
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            const txt = `C O N T I N U E ?   ${this.countDown}`
            ctx.font = Palette.font
            ctx.fillStyle = "white"
            ctx.fillText( txt, Math.floor(-ctx.measureText(txt).width/2), 0)
        }

    }

}