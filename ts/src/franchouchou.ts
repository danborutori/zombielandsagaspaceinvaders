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
                m.renderOrder = 1
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