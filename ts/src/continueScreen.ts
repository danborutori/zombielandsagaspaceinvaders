namespace zlsSpaceInvader {

    export class ContinueScreen extends GameObject {

        private countDown = 9
        private countCoolDown = 1

        constructor(
            readonly continueFunc: (b: boolean)=>void
        ){
            super()
            this.renderOrder = 1
            this.renderHalf = false
        }

        update( deltaTime: number ){
            super.update( deltaTime )

            if( Input.shared.pressAnyKey && this.countDown<9
            ){
                this.continueFunc( true )
                this.removeFromManager()
            }else{
                this.countCoolDown -= deltaTime
                if( this.countCoolDown<=0 )
                {
                    if( this.countDown <= 0 ){
                        this.continueFunc(false)
                        this.removeFromManager()
                    }else{
                        this.countDown -= 1
                        this.countCoolDown += 1
                    }
                }
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            const txt = `CONTINUE? ${this.countDown}`
            TextDrawer.shared.drawText( txt, Math.floor(-TextDrawer.shared.measure(txt)/2), -2, ctx)
        }

    }

}