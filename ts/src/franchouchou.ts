namespace zlsSpaceInvader {

    export const initMember = new FlightUnit(
        Sprites.shared.images["1"],
        Palette.BulletColor1
    )

    const foundMembers = [
        new FlightUnit(
            Sprites.shared.images["5"],
            Palette.BulletColor5
        ),
        new FlightUnit(
            Sprites.shared.images["6"],
            Palette.BulletColor6
        )
    ]

    export const missingMembers = [        
        new FlightUnit(
            Sprites.shared.images["4"],
            Palette.BulletColor4
        ),
        new FlightUnit(
            Sprites.shared.images["2"],
            Palette.BulletColor2
        ),
        new FlightUnit(
            Sprites.shared.images["3"],
            Palette.BulletColor3
        ),
        new FlightUnit(
            Sprites.shared.images["0"],
            Palette.BulletColor0
        ),
        new FlightUnit(
            Sprites.shared.images["p"],
            Palette.BulletColor1
        )
    ]

    export const knockdownMembers: FlightUnit[] = []

    let special: FlightUnit | undefined = new FlightUnit(
        Sprites.shared.images["7"],
        Palette.BulletColor7
    )

    export class Franchouchou extends GameObject {

        private units: FlightUnit[] = []

        get remainingMember(){
            return this.units.length
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
            this.reset(foundMembers)
        }

        update( deltaTime: number ){
            super.update( deltaTime )

            if(
                Input.shared.maimai &&
                special
            ){
                this.units.push(
                    special
                )
                special = undefined
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

        reset( renewUnits: FlightUnit[] ){
            this.units = Array.from(renewUnits)
        }
    }

}