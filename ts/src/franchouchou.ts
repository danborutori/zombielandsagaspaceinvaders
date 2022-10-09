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
        constructor(
            stage: Stage,
            manager: GameObjectManager
        ){
            for( let i=0; i<memberList.length; i++ ){
                const m = new SpriteObject( Sprites.shared.images[`${memberList[i]}`] )
                m.pos.x = stage.left+15+i*11
                m.pos.y = stage.bottom-18
                manager.add(m)
            }
        }
    }

}