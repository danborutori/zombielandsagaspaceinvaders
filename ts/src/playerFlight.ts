namespace zlsSpaceInvader {

    const padding = 4.5
    const invincibleInterval = 3

    export interface Member {
        sprite: HTMLImageElement
        bulletColor: string
    }

    export class PlayerFlight extends GameObject {

        private bulletCooldown = 0
        readonly isPlayerFlight = true
        next = false
        invincibleTime = 0
        canShoot = true

        flightUnits: FlightUnit[]

        constructor(            
            readonly stage: Stage,
            readonly nextMember: ()=>Member|null,
            readonly allMemberRunOut: ()=>void
        ){
            super()

            this.flightUnits = [
                new FlightUnit(
                    Sprites.shared.images[1],
                    Palette.BulletColor1
                )
            ]
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
                for( let u of this.flightUnits ){
                    const b = new Bullet(this.stage, u.bulletColor)
                    b.pos.copy(this.pos)
                    b.pos.x += u.pos.x
                    b.pos.y -= 6
                    this.manager.add(b)
                }
                this.bulletCooldown = Constant.playerFireInterval
                Audio.play( Audio.sounds.shoot )
            }

            if( this.next ){
                const m = this.nextMember()
                if( m ){
                    this.flightUnits = [
                        new FlightUnit(
                            m.sprite,
                            m.bulletColor
                        )
                    ]
                    this.visible = true
                    this.pos.x = 0
                    this.invincibleTime = invincibleInterval
                }else{
                    this.allMemberRunOut()
                }

                this.next = false
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime,ctx)

            for( let u of this.flightUnits ){
                ctx.drawImage(
                    u.sprite,
                    Math.floor(this.pos.x+u.pos.x-u.sprite.width/2),
                    Math.floor(this.pos.y+u.pos.y-u.sprite.height/2)
                )
            }
        }

        reset(){
            this.flightUnits = [
                new FlightUnit(
                    Sprites.shared.images[1],
                    Palette.BulletColor1
                )
            ]
            this.visible = true
            this.pos.x = 0
        }
    }

    export class FlightUnit {

        readonly pos = new Vector2

        constructor(
            readonly sprite: HTMLImageElement,
            readonly bulletColor: string
        ){}

    }

}