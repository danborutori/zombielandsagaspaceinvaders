namespace zlsSpaceInvader {

    const v1 = new Vector2
    const v2 = new Vector2

    export class Grenade extends EnemyBullet {
        
        private time = 0
        private playerBullet = false

        update( deltaTime: number ){
            super.update( deltaTime )
            this.time += deltaTime

            if( this.manager ){

                if( !this.playerBullet ){
                    for( let b of this.manager.playerBullets ){
                        if( this.pos.distance(b.pos)<4 ){
                            this.velocity.y *= -1
                            this.color = b.color
                            this.playerBullet = true
                            this.canHitPlayer = false
                            b.removeFromManager()
                            break
                        }
                    }
                }

                if( this.time>1 ){
                    for( let i=0; i<8; i++ ){
                        const a = i*Math.PI*2/8
                        let b: Bullet
                        if(this.playerBullet){
                            b = new PlayerBullet(
                                this.stage,
                                this.color
                            )
                            b.velocity.set(
                                Math.sin(a),
                                -Math.cos(a)
                            ).multiply(Constant.bulletSpeed)
                        }else{
                            b = new EnemyBullet(
                                this.stage,
                                v1.set(
                                    Math.sin(a),
                                    -Math.cos(a)
                                ),
                                this.shooter
                            )
                        }
                        b.pos.copy(this.pos)
                        this.manager.add(b)
                    }
                    this.removeFromManager()
                }
            }
        }
        
        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            const spr = Sprites.shared.images["grenade"]
            ctx.save()
            ctx.translate(Math.floor(this.pos.x), Math.floor(this.pos.y))
            ctx.rotate(this.time*Math.PI*4)
            ctx.drawImage(
                spr,
                Math.floor(-spr.width/2),
                Math.floor(-spr.height/2)
            )
            ctx.restore()
        }

    }

}