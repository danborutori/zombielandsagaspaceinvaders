namespace zlsSpaceInvader {

    export class PlayerPoweredShot{

        private normalBulletCooldown = 0

        update( deltaTime: number, player: PlayerFlight ){
            this.normalBulletCooldown -= deltaTime

            if( Input.shared.fire &&
                player.manager &&
                player.canShoot
            ){
                if(this.normalBulletCooldown<=0){
                    // shoot forward
                    for( let i=0, end = player.flightUnits.length; i<end; i++ ){
                        if( Math.abs(i+0.5-end/2) < 1 || // middle two
                            i==0 ||
                            i==end-1
                        ){
                            const u = player.flightUnits[i]
                            const b = new PlayerBullet(player.stage, u.bulletColor)
                            b.pos.copy(player.pos)
                            b.pos.x += u.pos.x
                            b.pos.y -= 6
                            switch( i ){
                            case 0:
                                b.velocity.rotateAround(-10*Math.PI/180)
                                break
                            case end-1:
                                b.velocity.rotateAround(10*Math.PI/180)
                                break
                            }
                            player.manager.add(b)
                        }
                    }
                    this.normalBulletCooldown = Constant.playerFireInterval
                    Audio.play( Audio.sounds.shoot )
                }
            }
        }

    }

}