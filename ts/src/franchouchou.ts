namespace zlsSpaceInvader {

    const memberList = [
        {
            no: 5,
            bulletColor: Palette.BulletColor5
        },
        {
            no: 6,
            bulletColor: Palette.BulletColor6
        },
        {
            no: 4,
            bulletColor: Palette.BulletColor4
        },
        {
            no: 2,
            bulletColor: Palette.BulletColor2
        },
        {
            no: 3,
            bulletColor: Palette.BulletColor3
        },
        {
            no: 0,
            bulletColor: Palette.BulletColor0
        },
        {
            no: 7,
            bulletColor: Palette.BulletColor7
        }
    ]

    export class Franchouchou extends GameObject {

        private units: FlightUnit[] = []

        private canCallMaiMai = true

        get remainingMember(){
            return this.units.length+1
        }

        get nextMember(){
            if( this.units.length>0 ){                
                const m = this.units.pop()
                return m!
            }
            return null
        }

        constructor(
            readonly stage: Stage,
            readonly manager: GameObjectManager
        ){
            super()
            this.renderOrder = 1
            this.reset()
        }

        update( deltaTime: number ){
            super.update( deltaTime )

            if(
                Input.shared.maimai &&
                this.canCallMaiMai
            ){
                this.units.push(
                    new FlightUnit(
                        Sprites.shared.images[`${memberList[6].no}`],
                        memberList[6].bulletColor
                    )    
                )
                this.canCallMaiMai = false
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )

            for( let i=0; i<this.units.length; i++ ){
                const spr =this.units[i].sprite

                ctx.drawImage(
                    spr,
                    Math.floor(this.stage.left+15+i*11-spr.width/2),
                    Math.floor(this.stage.bottom-9-spr.height/2)
                )
            }
        }

        reset(){
            this.canCallMaiMai = true
            this.units = memberList.slice(0,6).map( m=>
                new FlightUnit(
                    Sprites.shared.images[`${m.no}`],
                    m.bulletColor
                )
            )
        }
    }

}