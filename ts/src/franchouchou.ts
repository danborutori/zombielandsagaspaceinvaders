namespace zlsSpaceInvader {

    const memberList = [
        5,
        6,
        4,
        2,
        3,
        0
    ]

    export class Franchouchou {

        remainingMember = 7
        private members: GameObject[] = []

        get nextSprite(){
            this.remainingMember--
            if( this.remainingMember-1>=0 ){
                const m = this.members[this.remainingMember-1]
                m.manager && m.manager.remove(m)
                return Sprites.shared.images[`${memberList[this.remainingMember-1]}`]
            }
            return null
        }

        constructor(
            stage: Stage,
            readonly manager: GameObjectManager
        ){
            for( let i=0; i<memberList.length; i++ ){
                const m = new SpriteObject( Sprites.shared.images[`${memberList[i]}`] )
                m.pos.x = stage.left+15+i*11
                m.pos.y = stage.bottom-18
                manager.add(m)
                this.members.push(m)
            }
        }

        reset(){
            this.remainingMember = 7
            for( let m of this.members ){
                if(!m.manager){
                    this.manager.add(m)
                }
            }
        }
    }

}