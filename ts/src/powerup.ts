namespace zlsSpaceInvader {
    const v1 = new Vector2
    const v2 = new Vector2

    const speed = 20

    const powerupCollider = new ColliderBox(new Vector2(9,9))

    export class PowerUp extends SpriteObject {

        private time = 0

        constructor(
            readonly scorer: ScoreAndCredit,
            readonly nextMember: ()=>FlightUnit | null
        ){
            super(
                Sprites.shared.images["powerup"]
            )
        }

        update(deltaTime: number): void {
            super.update(deltaTime)
            this.time += deltaTime
            this.pos.y += speed*deltaTime

            if( this.pos.y>=this.scorer.stage.bottom+4.5 ){
                this.removeFromManager()
            }else{
                this.collidePlayer()
            }
        }

        private collidePlayer(){
            if( this.manager ){
                for( let p of this.manager.playerFlights ){
                    for( let u of p.flightUnits ){
                        if( CollisionChecker.intersect(
                            powerupCollider,
                            this.pos,
                            u.collisionShape,
                            v1.add(p.pos,u.pos),
                            v2
                         )){
                            const nextMember = this.nextMember()
                            if( nextMember ){
                                p.add([nextMember])
                            }else{
                                this.scorer.score += 1000
                                const text = new FloatingText("1000")
                                text.pos.copy(v2)
                                this.manager.add(text)
                            }
                            Audio.play(Audio.sounds.bonus)
                            this.removeFromManager()
                            break
                         }
                    }
                }
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            
            ctx.filter = `brightness(${Math.floor(Math.cos(Math.PI*2*this.time/0.5)*400)}%)`
            ctx.drawImage(
                this.sprite,
                Math.floor(this.pos.x-this.sprite.width/2)+1,
                Math.floor(this.pos.y-this.sprite.height/2)
            )
            ctx.drawImage(
                this.sprite,
                Math.floor(this.pos.x-this.sprite.width/2)-1,
                Math.floor(this.pos.y-this.sprite.height/2)
            )
            ctx.drawImage(
                this.sprite,
                Math.floor(this.pos.x-this.sprite.width/2),
                Math.floor(this.pos.y-this.sprite.height/2)+1
            )
            ctx.drawImage(
                this.sprite,
                Math.floor(this.pos.x-this.sprite.width/2),
                Math.floor(this.pos.y-this.sprite.height/2)-1
            )
            ctx.filter = "none"

            super.render( deltaTime, ctx )

        }

    }
    
}