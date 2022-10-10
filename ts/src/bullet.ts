namespace zlsSpaceInvader {

    export class Bullet extends SpriteObject {

        readonly isBullet = true

        constructor(
            readonly stage: Stage
        ){
            super( Sprites.shared.images["bullet"])
        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            this.pos.y -= Constant.bulletSpeed*deltaTime
            if( this.pos.y<=this.stage.up ){
                this.removeFromManager()
            }
        }
    }

}