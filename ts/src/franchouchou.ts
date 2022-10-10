namespace zlsSpaceInvader {

    const memberList = [
        5,
        6,
        4,
        2,
        3,
        0,
        7
    ]

    export class Franchouchou extends GameObject {

        remainingMember = 7
        private members: SpriteObject[] = []
        private canCallMaiMai = true

        get nextSprite(){
            this.remainingMember--
            if( this.remainingMember-1>=0 ){
                const m = this.members[this.remainingMember-1]
                m.removeFromManager()
                return Sprites.shared.images[`${memberList[this.remainingMember-1]}`]
            }
            return null
        }

        constructor(
            readonly stage: Stage,
            readonly manager: GameObjectManager
        ){
            super()
            for( let i=0; i<memberList.length; i++ ){
                const m = new SpriteObject( Sprites.shared.images[`${memberList[i]}`] )
                m.pos.x = stage.left+15+i*11
                m.pos.y = stage.bottom-18
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