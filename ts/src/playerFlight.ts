namespace zlsSpaceInvader {

    const padding = 4.5
    const invincibleInterval = 3

    export interface Member {
        sprite: HTMLImageElement
        bulletColor: string
    }

    export class PlayerFlight extends SpriteObject {

        private bulletCooldown = 0
        readonly isPlayerFlight = true
        next = false
        invincibleTime = 0
        canShoot = true
        private bulletColor = Palette.BulletColor1

        constructor(            
            readonly stage: Stage,
            readonly nextMember: ()=>Member|null,
            readonly allMemberRunOut: ()=>void
        ){
            super(Sprites.shared.images[1])
        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            this.invincibleTime -= deltaTime

            if( Input.shared.left )
                this.pos.x -= Constant.playerMoveSpeed*deltaTime
            if( Input.shared.right )
                this.pos.x += Constant.playerMoveSpeed*deltaTime                

            this.pos.x = Math.max(this.pos.x, this.stage.left+padding)
            this.pos.x = Math.min(this.pos.x, this.stage.right-padding)

            this.bulletCooldown -= deltaTime

            if( Input.shared.fire && this.bulletCooldown<=0 && this.manager && this.canShoot ){
                const b = new Bullet(this.stage, this.bulletColor)
                b.pos.copy(this.pos)
                b.pos.y -= 6
                this.manager.add(b)
                this.bulletCooldown = Constant.playerFireInterval
                Audio.play( Audio.sounds.shoot )
            }

            if( this.next ){
                const m = this.nextMember()
                if( m ){
                    this.sprite = m.sprite
                    this.bulletColor = m.bulletColor
                    this.visible = true
                    this.pos.x = 0
                    this.invincibleTime = invincibleInterval
                }else{
                    this.allMemberRunOut()
                }

                this.next = false
            }
        }

        reset(){
            this.sprite = Sprites.shared.images[1]
            this.bulletColor = Palette.BulletColor1
            this.visible = true
            this.pos.x = 0
        }
    }

}