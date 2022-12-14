namespace zlsSpaceInvader {

    const invincibleInterval = 3

    export interface Member {
        sprite: HTMLImageElement
        bulletColor: string
    }

    export class PlayerFlight extends GameObject {

        readonly isPlayerFlight = true
        next = false
        invincibleTime = 0
        canShoot = true

        flightUnits: FlightUnit[] = []

        private renderTime = 0

        private poweredShot = new PlayerPoweredShot()

        constructor(            
            readonly stage: Stage,
            readonly nextMember: ()=>FlightUnit|null,
            readonly allMemberRunOut: ()=>void
        ){
            super()

            this.reset(initMember)
        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            this.invincibleTime -= deltaTime

            if( this.pos.y>this.stage.bottom-35 ){
                this.pos.y = Math.max(this.pos.y-100*deltaTime,this.stage.bottom-35)
            }else{
                if( Input.shared.left )
                    this.pos.x -= Constant.playerMoveSpeed*deltaTime
                if( Input.shared.right )
                    this.pos.x += Constant.playerMoveSpeed*deltaTime
            }

            const padding = this.flightUnits.length*9/2

            this.pos.x = Math.max(this.pos.x, this.stage.left+padding)
            this.pos.x = Math.min(this.pos.x, this.stage.right-padding)

            if( this.next ){
                this.doNextMember()

                this.next = false
            }else{
                this.poweredShot.update( deltaTime, this )
            }

            for( let u of this.flightUnits ){
                if( u.powered ){
                    u.pos.rotateAround(Math.PI*2*deltaTime)
                }
            }
        }

        private async doNextMember(){
            this.invincibleTime = 3
            this.canShoot = false
            await this.wait(2)

            const m = this.nextMember()
            if( m ){
                for( let u of this.flightUnits ){
                    knockdownMembers.push(u)
                }
                this.reset(m)
                this.invincibleTime = invincibleInterval
            }else{
                for( let u of this.flightUnits ){
                    knockdownMembers.push(u)
                }
                this.flightUnits.length = 0
                this.allMemberRunOut()
            }
            this.canShoot = true
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime,ctx)

            this.renderTime += deltaTime

            for( let u of this.flightUnits ){
                if( u.powered ){
                    ctx.filter = `brightness(${Math.floor(Math.cos(Math.PI*2*this.renderTime/0.5)*400)}%)`
                    ctx.drawImage(
                        u.sprite,
                        Math.floor(this.pos.x+u.pos.x-u.sprite.width/2)+1,
                        Math.floor(this.pos.y+u.pos.y-u.sprite.height/2)
                    )
                    ctx.drawImage(
                        u.sprite,
                        Math.floor(this.pos.x+u.pos.x-u.sprite.width/2)-1,
                        Math.floor(this.pos.y+u.pos.y-u.sprite.height/2)
                    )
                    ctx.drawImage(
                        u.sprite,
                        Math.floor(this.pos.x+u.pos.x-u.sprite.width/2),
                        Math.floor(this.pos.y+u.pos.y-u.sprite.height/2)+1
                    )
                    ctx.drawImage(
                        u.sprite,
                        Math.floor(this.pos.x+u.pos.x-u.sprite.width/2),
                        Math.floor(this.pos.y+u.pos.y-u.sprite.height/2)-1
                    )
                    ctx.filter = "none"
                }
                ctx.drawImage(
                    u.sprite,
                    Math.floor(this.pos.x+u.pos.x-u.sprite.width/2),
                    Math.floor(this.pos.y+u.pos.y-u.sprite.height/2)
                )
            }
        }

        reset( flightUnit: FlightUnit ){
            this.flightUnits = [
                flightUnit
            ]
            flightUnit.pos.set(0,0)
            this.visible = true
            this.pos.set(0,this.stage.bottom)
            this.poweredShot.assignGun( this )
        }

        add( units: FlightUnit[] ){
            const positioningIndex = Math.floor(this.flightUnits.length/2)                
            const leftMostPos = this.flightUnits[positioningIndex].pos.x
            for( let u of units )
                this.flightUnits.push( u )
            for( let i=0; i<this.flightUnits.length; i++ ){
                const u = this.flightUnits[i]
                u.pos.x = (i-(this.flightUnits.length-1)/2)*9
                u.pos.y = 0
            }
            this.pos.x += leftMostPos-this.flightUnits[positioningIndex].pos.x
            this.poweredShot.assignGun( this )
        }

        remove( index: number ){
            if( this.flightUnits.length>1 ){
                let positioningIndex = Math.floor(this.flightUnits.length/2)
                if( positioningIndex==index ){
                    if( positioningIndex+1<this.flightUnits.length)
                        positioningIndex++
                    else
                        positioningIndex--
                }
                const positioningUnit = this.flightUnits[positioningIndex]
                const leftMostPos = positioningUnit.pos.x
                knockdownMembers.push( this.flightUnits.splice(index, 1)[0] )
                for( let i=0; i<this.flightUnits.length; i++ ){
                    const u = this.flightUnits[i]
                    u.pos.x = (i-(this.flightUnits.length-1)/2)*9
                    u.pos.y = 0
                }
                this.pos.x += leftMostPos-positioningUnit.pos.x
                this.invincibleTime = 1

                this.poweredShot.assignGun(this)
            }else{
                this.visible = false
                this.next = true
            }
        }
    }

    const collisionShape = new ColliderBox(new Vector2(9,9))

    export class FlightUnit {

        readonly pos = new Vector2
        readonly collisionShape = collisionShape
        powered = false

        constructor(
            readonly sprite: HTMLImageElement,
            readonly bulletColor: string
        ){}

    }

}