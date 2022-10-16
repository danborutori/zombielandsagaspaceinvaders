namespace zlsSpaceInvader {

    const memberList = [
        {
            no: 5,
            bulletColor: "#FF2C61"
        },
        {
            no: 6,
            bulletColor: "#FFEB48"
        },
        {
            no: 4,
            bulletColor: "#D1E0E3"
        },
        {
            no: 2,
            bulletColor: "#FFB950"
        },
        {
            no: 3,
            bulletColor: "#3851FF"
        },
        {
            no: 0,
            bulletColor: "#E545FF"
        },
        {
            no: 7,
            bulletColor: "#3FEE3B"
        }
    ]

    export class Franchouchou extends GameObject {

        remainingMember = 7
        private members: SpriteObject[] = []
        private canCallMaiMai = true

        get nextMember(){
            this.remainingMember--
            if( this.remainingMember-1>=0 ){
                const m = this.members[this.remainingMember-1]
                m.removeFromManager()
                const mb = memberList[this.remainingMember-1]
                return {
                    sprite: Sprites.shared.images[`${mb.no}`],
                    bulletColor: mb.bulletColor
                }
            }
            return null
        }

        constructor(
            readonly stage: Stage,
            readonly manager: GameObjectManager
        ){
            super()
            for( let i=0; i<memberList.length; i++ ){
                const m = new SpriteObject( Sprites.shared.images[`${memberList[i].no}`] )
                m.pos.x = stage.left+15+i*11
                m.pos.y = stage.bottom-9
                this.members.push(m)
                if( i<=this.remainingMember-2 ){
                    manager.add(m)
                }
            }
        }

        update( deltaTime: number ){
            super.update( deltaTime )

            if(
                this.remainingMember==7 &&
                Input.shared.maimai &&
                this.canCallMaiMai
            ){
                this.remainingMember = 8
                this.manager.add(this.members[6])
                this.canCallMaiMai = false
            }
        }

        reset(){
            this.remainingMember = 7
            this.canCallMaiMai = true
            for( let i=0; i<this.members.length; i++ ){
                const m = this.members[i]
                if( i<=this.remainingMember-2 ){
                    this.manager.add(m)
                }
            }
        }
    }

}