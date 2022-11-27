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

        shot( deltaTime: number ){
            if( this.cooldown>0 )
                this.cooldown -= deltaTime
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

    export class PlayerPoweredShot{
        private gun: WeakMap<FlightUnit,Gun> = new WeakMap()

        update( deltaTime: number, player: PlayerFlight ){
            if( Input.shared.fire &&
                player.canShoot
            ){
                for( let u of player.flightUnits ){
                    const g = this.gun.get(u)
                    if( g ) g.shot(deltaTime)
                }
            }
        }

        assignGun( player: PlayerFlight ){
            for( let i=0; i<player.flightUnits.length; i++ ){
                const u = player.flightUnits[i]
                this.gun.set( u, new NormalShot(player,u,0) )
            }

            if( player.flightUnits.length>=3 ){
                for( let i of [0,player.flightUnits.length-1] ){
                    const u = player.flightUnits[i]
                    this.gun.set(
                        u,
                        new NormalShot(
                            player,
                            u,
                            i==0?-10*Math.PI/180:10*Math.PI/180
                        )
                    )
                }
            }

            if( player.flightUnits.length>=5 ){
                for( let i of [1,player.flightUnits.length-2] ){
                    const u = player.flightUnits[i]
                    this.gun.set(
                        u,
                        new FingerBeamGun(
                            player,
                            u,
                            i==1?1:-1
                        )
                    )
                }
            }

            if( player.flightUnits.length>=7 ){
                for( let i of [2,player.flightUnits.length-3] ){
                    const u = player.flightUnits[i]
                    this.gun.set(
                        u,
                        new SquareLaserGun(
                            player,
                            u,
                            i==1?1:-1
                        )
                    )
                }
            }
        }
    }

}