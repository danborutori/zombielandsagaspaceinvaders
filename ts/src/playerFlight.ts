namespace zlsSpaceInvader {

    const padding = 4.5

    export class PlayerFlight extends SpriteObject {

        private bulletCooldown = 0
        readonly isPlayerFlight = true
        next = false

        constructor(            
            readonly stage: Stage,
            readonly nextSprite: ()=>HTMLImageElement|null,
            readonly enemyBackOff: ()=>void,
            readonly allMemberRunOut: ()=>void
        ){
            super(Sprites.shared.images[1])
        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            if( Input.shared.left )
                this.pos.x -= Constant.playerMoveSpeed*deltaTime
            if( Input.shared.right )
                this.pos.x += Constant.playerMoveSpeed*deltaTime                

            this.pos.x = Math.max(this.pos.x, this.stage.left+padding)
            this.pos.x = Math.min(this.pos.x, this.stage.right-padding)

            this.bulletCooldown -= deltaTime

            if( Input.shared.fire && this.bulletCooldown<=0 && this.manager ){
                const b = new Bullet(this.stage)
                b.pos.copy(this.pos)
                this.manager.add(b)
                this.bulletCooldown = Constant.playerFireInterval
            }

            if( this.next ){
                const spr = this.nextSprite()
                if( spr ){
                    this.sprite = spr
                    this.pos.x = 0
                    this.enemyBackOff()
                }else{
                    this.allMemberRunOut()
                }

                this.next = false
            }
        }

        reset(){
            this.sprite = Sprites.shared.images[1]
            this.pos.x = 0
        }
    }

}