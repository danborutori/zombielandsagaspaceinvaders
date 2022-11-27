namespace zlsSpaceInvader {

    const beamInterval = 2
    const squareBeamInterval = 0.3

    export class PlayerPoweredShot{

        private normalBulletCooldown = 0
        private fingerBeamCooldown = 0
        private fingerBeamCount = 0
        private squareBeamCooldown = 0
        private squareBeamCount = 0

        update( deltaTime: number, player: PlayerFlight ){
            if( this.normalBulletCooldown>0 )
                this.normalBulletCooldown -= deltaTime
            if( this.fingerBeamCooldown>0 )
                this.fingerBeamCooldown -= deltaTime
            if( this.squareBeamCooldown>0 )
                this.squareBeamCooldown -= deltaTime

            if( Input.shared.fire &&
                player.canShoot
            ){
                this.normalShot(player)
                this.fingerBeam(player)
                this.squareBeam(player)
            }
        }

        private normalShot( player: PlayerFlight ){
            if(
                this.normalBulletCooldown<=0 &&
                player.manager
            ){
                let playSound = false
                for( let i=0, end = player.flightUnits.length; i<end; i++ ){
                    if( Math.abs(i+0.5-end/2) < 1 || // middle two
                        i==0 ||                      // left
                        i==end-1                     //right
                    ){
                        const u = player.flightUnits[i]
                        const b = new PlayerBullet(player.stage, u.bulletColor)
                        b.pos.copy(player.pos)
                        b.pos.x += u.pos.x
                        b.pos.y -= 6
                        if( end>=3 ){
                            switch( i ){
                            case 0:
                                b.velocity.rotateAround(-10*Math.PI/180)
                                break
                            case end-1:
                                b.velocity.rotateAround(10*Math.PI/180)
                                break
                            }
                        }
                        player.manager.add(b)
                        playSound = true
                    }
                }
                this.normalBulletCooldown += Constant.playerFireInterval
                playSound && Audio.play( Audio.sounds.shoot )
            }
        }

        private fingerBeam( player: PlayerFlight ){
            if( this.fingerBeamCooldown<=0 &&
                player.manager
            ){
                let playSound = false
                for( let i=0, end = player.flightUnits.length; i<end; i++ ){
                    const tmp = Math.abs(i+0.5-end/2)
                    if( tmp>=1 && tmp<2 &&
                        i>0 && i<end-1
                    ){
                        const clockwise =
                            (this.fingerBeamCount%2==0?1:-1)*
                            ((i+0.5)>end/2?1:-1)
                        const u = player.flightUnits[i]
                        const b = new FingerBeam(player, u, clockwise)
                        b.pos.copy(player.pos)
                        b.pos.x += u.pos.x
                        b.pos.y -= 6                        
                        player.manager.add(b)
                        playSound = true
                    }
                }

                this.fingerBeamCooldown += beamInterval
                this.fingerBeamCount++
                playSound && Audio.play( Audio.sounds.fingerLaser )
            }
        }

        private squareBeam( player: PlayerFlight ){
            if( this.squareBeamCooldown<=0 &&
                player.manager
            ){
                let playSound = false
                for( let i=0, end = player.flightUnits.length; i<end; i++ ){
                    const tmp = Math.abs(i+0.5-end/2)
                    if( tmp>=2 && tmp<3 &&
                        i>0 && i<end-1
                    ){
                        const clockwise =
                            (this.squareBeamCount%2==0?1:-1)*
                            ((i+0.5)>end/2?1:-1)
                        const u = player.flightUnits[i]
                        const b = new SquareBeam(player, u)
                        b.pos.copy(player.pos)
                        b.pos.x += u.pos.x
                        b.pos.y -= 6                        
                        b.velocity.rotateAround(-Math.PI/4*clockwise)
                        player.manager.add(b)
                        playSound = true
                    }
                }

                this.squareBeamCooldown += squareBeamInterval
                this.squareBeamCount++
                playSound && Audio.play( Audio.sounds.fingerLaser )
            }
        }
    }

}