namespace zlsSpaceInvader {

    const laserSpriteCenter = new Vector2(-4,70)

    const laserEmptyCollisionShape = new ColliderCompoundShape()
    const laserCollisionShape = new ColliderBox( new Vector2(6,223) )

    export class BigLaser extends PlayerBullet {

        private animation: AnimatedSpriteObject
        private cooldown = 0

        constructor(
            player: PlayerFlight,
            readonly unit: FlightUnit
        ){
            super(player, "#0042FF")
            this.damage = 1.5
            this.cancelEnemyBullet = true

            this.animation = new AnimatedSpriteObject([
                Sprites.shared.images.blaser0,
                Sprites.shared.images.blaser1,
                Sprites.shared.images.blaser2,
                Sprites.shared.images.blaser3,
                Sprites.shared.images.blaser4,
                Sprites.shared.images.blaser5,
                Sprites.shared.images.blaser6,
                Sprites.shared.images.blaser5,
                Sprites.shared.images.blaser6,
                Sprites.shared.images.blaser5,
                Sprites.shared.images.blaser6,
                Sprites.shared.images.blaser5,
                Sprites.shared.images.blaser6,
                Sprites.shared.images.blaser5,
                Sprites.shared.images.blaser6,
                Sprites.shared.images.blaser5,
                Sprites.shared.images.blaser6,
                Sprites.shared.images.blaser7,
                Sprites.shared.images.blaser8,
            ], 0.05)
            ;(this.animation as any).pos = this.pos
            this.animation.removeFromManager = ()=>{
                this.removeFromManager()
            }
        }

        onHitEnemy(hitPoint: Vector2): void {
            this.spark(hitPoint)
            this.cooldown = 0.1
        }

        update(deltaTime: number): void {
            super.update(deltaTime)
            this.animation.update( deltaTime )
            this.pos.add( this.shooter.pos, this.unit.pos ).sub(laserSpriteCenter)
            this.pos.y -= 10
            this.cooldown -= deltaTime

            if( this.animation.frame>=5 && this.animation.frame<17 && this.cooldown<=0 ){
                this.collisionShape = laserCollisionShape
            }else{
                this.collisionShape = laserEmptyCollisionShape
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            this.animation.render( deltaTime, ctx )
        }
    }

}