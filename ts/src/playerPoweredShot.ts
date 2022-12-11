namespace zlsSpaceInvader {

    const beamInterval = 2
    const squareBeamInterval = 0.3

    abstract class Gun {
        protected cooldown = 0
        abstract get interval(): number

        constructor(
            readonly playerFlight: PlayerFlight,
            readonly unit: FlightUnit
        ){}

        abstract makeBullet(): void

        update( deltaTime: number ){
            if( this.cooldown>0 )
                this.cooldown -= deltaTime
        }

        shot(){
            if( this.cooldown<=0 ){
                this.makeBullet()
                this.cooldown += this.interval
            }
        }
    }

    class NormalShot extends Gun {
        constructor(
            playerFlight: PlayerFlight,
            unit: FlightUnit,
            readonly angle: number
        ){
            super( playerFlight, unit )
        }

        readonly interval = Constant.playerFireInterval

        makeBullet(){
            if( this.playerFlight.manager ){
                const b = new PlayerBullet(this.playerFlight.stage, this.unit.bulletColor)
                b.pos.copy(this.playerFlight.pos)
                b.pos.x += this.unit.pos.x
                b.pos.y -= 6
                b.velocity.rotateAround(this.angle)
                this.playerFlight.manager.add(b)
                Audio.play( Audio.sounds.shoot )
            }
        }
    }

    class FingerBeamGun extends Gun {
        private count = 0

        readonly interval = beamInterval

        constructor(
            playerFlight: PlayerFlight,
            unit: FlightUnit,
            readonly clockwise: number
        ){
            super( playerFlight, unit )
        }

        makeBullet(): void {
            if( this.playerFlight.manager ){
                const clockwise = (this.count%2==0?1:-1)*this.clockwise
                const b = new FingerBeam(this.playerFlight, this.unit, clockwise)
                b.pos.copy(this.playerFlight.pos)
                b.pos.x += this.unit.pos.x
                b.pos.y -= 6                        
                this.playerFlight.manager.add(b)

                this.count++
                Audio.play( Audio.sounds.fingerLaser )
            }
        }
    }

    class SquareLaserGun extends Gun {

        private count = 0

        readonly interval = squareBeamInterval

        constructor(
            playerFlight: PlayerFlight,
            unit: FlightUnit,
            readonly clockwise: number
        ){
            super( playerFlight, unit )
        }

        makeBullet(): void {
            if( this.playerFlight.manager ){
                const clockwise = (this.count%2==0?1:-1)*this.clockwise
                const b = new SquareBeam(this.playerFlight, this.unit)
                b.pos.copy(this.playerFlight.pos)
                b.pos.x += this.unit.pos.x
                b.pos.y -= 6                        
                b.velocity.rotateAround(-Math.PI/4*clockwise)
                this.playerFlight.manager.add(b)

                this.count++
                Audio.play( Audio.sounds.fingerLaser )
            }
        }
    }

    class BigLaserGun extends Gun {
        readonly interval = 1

        makeBullet() {
            if( this.playerFlight.manager ){
                const b = new BigLaser(this.playerFlight, this.unit)
                b.pos.copy(this.playerFlight.pos)
                b.pos.x += this.unit.pos.x          
                this.playerFlight.manager.add(b)

                Audio.play( Audio.sounds.eyeLaser )
            }
        }
    }

    export class PlayerPoweredShot{
        private gun: WeakMap<FlightUnit,Gun> = new WeakMap()

        update( deltaTime: number, player: PlayerFlight ){
            
            for( let u of player.flightUnits ){
                const g = this.gun.get(u)
                if( g ){
                    g.update( deltaTime )
                    if( Input.shared.fire &&
                        player.canShoot
                    )
                        g.shot()
                } 
            }
        }

        assignGun( player: PlayerFlight ){
            for( let i=0; i<player.flightUnits.length; i++ ){
                const u = player.flightUnits[i]
                u.powered = false
                this.gun.set( u, new NormalShot(player,u,0) )
            }

            if( player.flightUnits.length>=3 ){
                let index: number[]
                switch(player.flightUnits.length){
                case 3:
                    index = [0,2]
                    break
                case 4:
                    index = [0,3]
                    break
                case 5:
                    index = [0,4]
                    break
                case 6:
                    index = [0,5]
                    break
                default:
                    index = [1,player.flightUnits.length-2]
                    break
                }
                let cnt = 0
                for( let i of index ){
                    const u = player.flightUnits[i]
                    this.gun.set(
                        u,
                        new NormalShot(
                            player,
                            u,
                            cnt++?10*Math.PI/180:-10*Math.PI/180
                        )
                    )
                }
            }

            if( player.flightUnits.length>=5 ){
                let index: number[]
                switch(player.flightUnits.length){
                case 5:
                    index = [1,3]
                    break
                case 6:
                    index = [1,4]
                    break
                default:
                    index = [2,player.flightUnits.length-3]
                    break
                }
                let cnt = 0
                for( let i of index ){
                    const u = player.flightUnits[i]
                    this.gun.set(
                        u,
                        new FingerBeamGun(
                            player,
                            u,
                            cnt++?-1:1
                        )
                    )
                }
            }

            if( player.flightUnits.length>=7 ){
                for( let i of [0,player.flightUnits.length-1] ){
                    const u = player.flightUnits[i]
                    u.powered = true
                    this.gun.set(
                        u,
                        new SquareLaserGun(
                            player,
                            u,
                            i==0?1:-1
                        )
                    )
                }
            }

            if( player.flightUnits.length>=9 ){
                const u = player.flightUnits[Math.floor(player.flightUnits.length/2)]
                this.gun.set(
                    u,
                    new BigLaserGun(
                        player,
                        u
                    )
                )
            }
        }
    }

}